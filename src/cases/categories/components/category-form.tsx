
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { Label } from "../../../components/ui/label";
import { Button, Input } from "@base-ui/react";
import type { CategoryDTO } from "../dtos/category.dto";

interface CategoryFormProps {
  onSuccess: () => void;
  category?: CategoryDTO;
}

export function CategoryForm({ onSuccess, category }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "");

  const queryClient = useQueryClient();
  const isEditing = !!category;

  useEffect(() => {
    setName(category?.name ?? "");
    setIcon(category?.icon ?? "");
  }, [category]);

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        name: name.trim(),
        icon: icon.trim() || null,
      };

      if (isEditing) {
        const response = await api.patch(
          `/categories/${category.id}`,
          data
        );
        return response.data;
      }

      const response = await api.post("/categories", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setName("");
      setIcon("");
      onSuccess();
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) return;

    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da categoria</Label>
        <Input
          id="name"
          placeholder="Ex: Bebidas"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">URL do ícone (opcional)</Label>
        <Input
          id="icon"
          placeholder="https://..."
          value={icon}
          onChange={(event) => setIcon(event.target.value)}
        />
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">
          Erro ao salvar categoria. Verifique os dados.
        </p>
      )}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending
          ? "Salvando..."
          : isEditing
            ? "Salvar alterações"
            : "Cadastrar categoria"}
      </Button>
    </form>
  );
}
