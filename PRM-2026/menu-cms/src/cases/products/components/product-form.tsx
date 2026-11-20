
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductDTO } from "../dtos/product.dto";
import { useCategories } from "../../hooks/use.category";
import { Label } from "../../../components/ui/label";
import { Button, Input } from "@base-ui/react";
import { api } from "../../../services/api";

interface ProductFormProps {
  onSuccess: () => void;
  product?: ProductDTO;
}

export function ProductForm({ onSuccess, product }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [picture, setPicture] = useState(product?.picture ?? "");
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? "");

  const queryClient = useQueryClient();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const isEditing = !!product;

  useEffect(() => {
    setName(product?.name ?? "");
    setDescription(product?.description ?? "");
    setPrice(String(product?.price ?? ""));
    setPicture(product?.picture ?? "");
    setCategoryId(product?.category?.id ?? "");
  }, [product]);

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        picture: picture.trim() || undefined,
        categoryId: categoryId || undefined,
      };

      if (isEditing) {
        const response = await api.patch(`/products/${product.id}`, data);
        return response.data;
      }

      const response = await api.post("/products", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setName("");
      setDescription("");
      setPrice("");
      setPicture("");
      setCategoryId("");
      onSuccess();
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !name.trim() ||
      !price ||
      Number(price) < 0 ||
      !Number.isFinite(Number(price))
    ) {
      return;
    }

    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do produto</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: Hambúrguer artesanal"
          required
          maxLength={60}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descrição do produto"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Ex: 25.90"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <select
          id="category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          disabled={loadingCategories}
        >
          <option value="">Sem categoria</option>
          {categories
            ?.filter((category) => category.active)
            .map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="picture">URL da imagem</Label>
        <Input
          id="picture"
          value={picture}
          onChange={(event) => setPicture(event.target.value)}
          placeholder="https://..."
        />
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">
          Erro ao salvar produto. Confira os dados e tente novamente.
        </p>
      )}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending
          ? "Salvando..."
          : isEditing
            ? "Salvar alterações"
            : "Cadastrar produto"}
      </Button>
    </form>
  );
}
