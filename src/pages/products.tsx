
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { useProducts } from "../cases/products/hooks/use-product";
import { ProductForm } from "../cases/products/components/product-form";
import type { ProductDTO } from "../cases/products/dtos/product.dto";

import { api } from "../services/api";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useCategories } from "../cases/hooks/use.category";

export function ProductsPage() {
  const [categoryId, setCategoryId] = useState("");
  const { data: products, isLoading, isError } = useProducts(categoryId || undefined);
  const { data: categories } = useCategories();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    ProductDTO | undefined
  >();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <p className="p-6">Carregando produtos...</p>;
  }

  if (isError) {
    return <p className="p-6 text-red-500">Erro ao carregar produtos.</p>;
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos do cardápio.
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) setSelectedProduct(undefined);
          }}
        >
          <DialogTrigger
            render={
              <Button onClick={() => setSelectedProduct(undefined)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo produto
              </Button>
            }
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? "Editar produto" : "Novo produto"}
              </DialogTitle>
            </DialogHeader>

            <ProductForm
              product={selectedProduct}
              onSuccess={() => {
                setOpen(false);
                setSelectedProduct(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {deleteMutation.isError && (
        <p className="text-sm text-red-500">
          Não foi possível excluir o produto. Ele pode estar vinculado a um pedido.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de produtos</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="max-w-xs space-y-2">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Filtrar por categoria
            </label>

            <select
              id="category-filter"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Todas as categorias</option>
              {categories
                ?.filter((category) => category.active)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {products?.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum produto encontrado nesta categoria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Imagem</th>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3">Preço</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {products?.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-3">
                        {product.picture ? (
                          <img
                            src={product.picture}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs">
                            Sem foto
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-medium">{product.name}</td>

                      <td className="p-3">
                        {product.category?.name ?? "Sem categoria"}
                      </td>

                      <td className="p-3">
                        {Number(product.price).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>

                      <td className="p-3">
                        <Badge
                          variant={product.active ? "default" : "secondary"}
                        >
                          {product.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title="Editar"
                            onClick={() => {
                              setSelectedProduct(product);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            title="Excluir"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
