import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCategories } from "../cases/hooks/use.category";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { CategoryForm } from "../cases/categories/components/category-form";
import type { CategoryDTO } from "../cases/categories/category.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const { data: categories, isLoading, isError } = useCategories();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState("");

  {
    deleteError && <p className="text-sm text-red-500">{deleteError}</p>;
  }
  const deleteMutation = useMutation({
    onError: (error: any) => {
      setDeleteError(
        error.response?.data?.message ||
          "",
      );
    },
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryDTO | undefined
  >();

  if (isLoading) {
    return <p className="p-6">Carregando categorias...</p>;
  }

  if (isError) {
    return <p className="p-6 text-red-500">Erro ao carregar categorias.</p>;
  }

  return (
    <main className="min-h-screen bg-muted/40 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categorias</h1>
            <p className="text-muted-foreground">
              Gerencie as categorias do cardápio.
            </p>
          </div>

          <Dialog
            open={open}
            onOpenChange={(value) => {
              setOpen(value);
              if (!value) setSelectedCategory(undefined);
            }}
          >
            <DialogTrigger>
              <Button onClick={() => setSelectedCategory(undefined)}>
                <Plus />
                Nova categoria
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedCategory ? "Editar categoria" : "Nova categoria"}
                </DialogTitle>
              </DialogHeader>

              <CategoryForm
                category={selectedCategory}
                onSuccess={() => {
                  setOpen(false);
                  setSelectedCategory(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Categorias cadastradas ({categories?.length ?? 0})
            </CardTitle>
          </CardHeader>

          <CardContent>
            {categories?.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ícone</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {categories?.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={category.active ? "default" : "secondary"}
                        >
                          {category.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label="Editar categoria"
                            onClick={() => {
                              setSelectedCategory(category);
                              setOpen(true);
                            }}
                          >
                            <Pencil />
                          </Button>

                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Excluir categoria"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Deseja realmente excluir esta categoria?",
                                )
                              ) {
                                deleteMutation.mutate(category.id);
                              }
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
