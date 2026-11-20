
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useSpots } from "../cases/spots/hooks/use-spot";
import { SpotForm } from "../cases/spots/components/spot-form";
import type { SpotDTO } from "../cases/spots/dtos/spot.dto";
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

export function SpotsPage() {
  const { data: spots, isLoading, isError } = useSpots();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<SpotDTO | undefined>();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/spots/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spots"] });
    },
  });

  function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja realmente excluir esta mesa?");

    if (confirmed) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <p className="p-6">Carregando mesas...</p>;
  }

  if (isError) {
    return <p className="p-6 text-red-500">Erro ao carregar mesas.</p>;
  }

  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mesas</h1>
          <p className="text-muted-foreground">
            Gerencie as mesas do estabelecimento.
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            if (!value) setSelectedSpot(undefined);
          }}
        >
          <DialogTrigger
            render={
              <Button onClick={() => setSelectedSpot(undefined)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova mesa
              </Button>
            }
          />

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedSpot ? "Editar mesa" : "Cadastrar mesa"}
              </DialogTitle>
            </DialogHeader>

            <SpotForm
              spot={selectedSpot}
              onSuccess={() => {
                setOpen(false);
                setSelectedSpot(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {deleteMutation.isError && (
        <p className="text-sm text-red-500">
          Não foi possível excluir a mesa.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mesas cadastradas</CardTitle>
        </CardHeader>

        <CardContent>
          {!spots || spots.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhuma mesa cadastrada.
            </p>
          ) : (
            <div className="space-y-3">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{spot.name}</p>

                    <Badge variant={spot.active ? "default" : "secondary"}>
                      {spot.active ? "Ativa" : "Inativa"}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedSpot(spot);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(spot.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
