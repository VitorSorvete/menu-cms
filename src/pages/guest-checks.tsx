import { useCloseGuestCheck, useGuestChecks } from "../cases/guest-checks/hooks/use-guest-check";

export function GuestChecksPage() {
  const { data: guestChecks, isLoading, isError } = useGuestChecks();
  const closeGuestCheck = useCloseGuestCheck();

  if (isLoading) {
    return <p className="p-6">Carregando comandas...</p>;
  }

  if (isError) {
    return <p className="p-6 text-red-500">Erro ao carregar as comandas.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Comandas abertas</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe as comandas e os pedidos de cada mesa.
        </p>
      </div>

      {!guestChecks || guestChecks.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhuma comanda aberta no momento.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guestChecks.map((guestCheck) => (
            <div
              key={guestCheck.id}
              className="rounded-lg border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {guestCheck.spot.name}
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Aberta
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>
                  Abertura:{" "}
                  {new Date(guestCheck.createdAt).toLocaleString("pt-BR")}
                </p>
                <p>Status: {guestCheck.status}</p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm("Deseja realmente fechar esta comanda?")) {
                    closeGuestCheck.mutate(guestCheck.id);
                  }
                }}
                disabled={closeGuestCheck.isPending}
                className="mt-5 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Fechar comanda
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
