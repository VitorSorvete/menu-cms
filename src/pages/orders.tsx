import type { OrderDTO } from "../cases/orders/dtos/order.dto";
import { useOrders, useUpdateOrderStatus } from "../cases/orders/hooks/use-order";


const statusLabels: Record<OrderDTO["status"], string> = {
  NEW: "Novo",
  PREPARING: "Preparando",
  READY: "Pronto",
  DELIVERED: "Entregue",
};

const nextStatus: Partial<Record<OrderDTO["status"], OrderDTO["status"]>> = {
  NEW: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

export function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) {
    return <p className="p-6">Carregando pedidos...</p>;
  }

  if (isError) {
    return <p className="p-6 text-red-500">Erro ao carregar pedidos.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe os pedidos e atualize seus status.
        </p>
      </div>

      {!orders || orders.length === 0 ? (
        <p className="text-muted-foreground">Nenhum pedido cadastrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => {
            const targetStatus = nextStatus[order.status];

            return (
              <div
                key={order.id}
                className="space-y-4 rounded-lg border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">
                    {order.guestCheck.spot.name}
                  </h2>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {statusLabels[order.status]}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Pedido: {order.id.slice(0, 8)}
                </p>

                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString("pt-BR")}
                </p>

                <div className="space-y-3 border-t border-b py-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span>
                        {item.quantity}x {item.product.name}
                      </span>

                      <span>
                        R$ {Number(item.subtotal).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    R$ {Number(order.total).toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {targetStatus && (
                  <button
                    onClick={() =>
                      updateStatus.mutate({
                        id: order.id,
                        status: targetStatus,
                      })
                    }
                    disabled={updateStatus.isPending}
                    className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Avançar para {statusLabels[targetStatus]}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
