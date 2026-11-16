
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../services/api";
import { Button, Input } from "@base-ui/react";
import { Label } from "../../../components/ui/label";

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/categories", {
        name,
        icon: icon || null,
      });

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
          Erro ao cadastrar categoria. Verifique os dados.
        </p>
      )}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : "Cadastrar categoria"}
      </Button>
    </form>
  );
}
