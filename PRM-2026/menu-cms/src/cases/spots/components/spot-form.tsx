
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SpotDTO } from "../dtos/spot.dto";
import { api } from "../../../services/api";
import { Label } from "../../../components/ui/label";
import { Button, Input } from "@base-ui/react";

interface SpotFormProps {
  spot?: SpotDTO;
  onSuccess: () => void;
}

export function SpotForm({ spot, onSuccess }: SpotFormProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    setName(spot?.name ?? "");
    setActive(spot?.active ?? true);
  }, [spot]);

  const mutation = useMutation({
    mutationFn: async () => {
      const data = { name, ...(spot ? { active } : {}) };

      if (spot) {
        return api.patch(`/spots/${spot.id}`, data);
      }

      return api.post("/spots", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
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
        <Label htmlFor="spot-name">Nome da mesa</Label>
        <Input
          id="spot-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: Mesa 01"
          maxLength={60}
          required
        />
      </div>

      {spot && (
        <div className="flex items-center gap-2">
          <input
            id="spot-active"
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
          />
          <Label htmlFor="spot-active">Mesa ativa</Label>
        </div>
      )}

      {mutation.isError && (
        <p className="text-sm text-red-500">
          Não foi possível salvar a mesa.
        </p>
      )}

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending
          ? "Salvando..."
          : spot
            ? "Salvar alterações"
            : "Cadastrar mesa"}
      </Button>
    </form>
  );
}
