
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { OrderDTO } from "../cases/orders/dtos/order.dto";
import {
  useOrders,
  useUpdateOrderStatus,
} from "../cases/orders/hooks/use-order";

const statuses: OrderDTO["status"][] = [
  "NEW",
  "PREPARING",
  "READY",
  "DELIVERED",
];

const statusLabels: Record<OrderDTO["status"], string> = {
  NEW: "Novo",
  PREPARING: "Preparando",
  READY: "Pronto",
  DELIVERED: "Entregue",
};

const nextStatus: Partial<
  Record<OrderDTO["status"], OrderDTO["status"]>
> = {
  NEW: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

interface OrderCardProps {
  order: OrderDTO;
  disabled: boolean;
}

function OrderCard({ order, disabled }: OrderCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: order.id,
    data: {
      status: order.status,
    },
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab space-y-3 rounded-lg border bg-card p-4 shadow-sm active:cursor-grabbing"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {order.guestCheck.spot.name}
        </h3>

        <span className="text-xs text-muted-foreground">
          #{order.id.slice(0, 8)}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        {new Date(order.createdAt).toLocaleString("pt-BR")}
      </p>

      <div className="space-y-2 border-y py-3">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-2 text-sm"
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

      <div className="flex justify-between text-sm font-semibold">
        <span>Total</span>
        <span>
          R$ {Number(order.total).toFixed(2).replace(".", ",")}
        </span>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  status: OrderDTO["status"];
  orders: OrderDTO[];
  disabled: boolean;
}

function KanbanColumn({
  status,
  orders,
  disabled,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{statusLabels[status]}</h2>
        <span className="rounded-full bg-muted px-2 py-1 text-xs">
          {orders.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-64 space-y-3 rounded-lg border-2 border-dashed p-3 transition-colors ${
          isOver
            ? "border-primary bg-primary/10"
            : "border-muted"
        }`}
      >
        {orders.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum pedido
          </p>
        )}

        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const orderId = String(active.id);
    const targetStatus = String(over.id) as OrderDTO["status"];

    const order = orders?.find((item) => item.id === orderId);

    if (!order) return;

    if (!statuses.includes(targetStatus)) return;

    const allowedStatus = nextStatus[order.status];

    if (allowedStatus !== targetStatus) return;

    updateStatus.mutate({
      id: order.id,
      status: targetStatus,
    });
  }

  if (isLoading) {
    return <p className="p-6">Carregando pedidos...</p>;
  }

  if (isError) {
    return (
      <p className="p-6 text-red-500">
        Erro ao carregar pedidos.
      </p>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos - Kanban</h1>
        <p className="text-sm text-muted-foreground">
          Arraste os pedidos para a próxima etapa de atendimento.
        </p>
      </div>

      {updateStatus.isError && (
        <p className="text-sm text-red-500">
          Não foi possível atualizar o pedido. Tente novamente.
        </p>
      )}

      {!orders || orders.length === 0 ? (
        <p className="text-muted-foreground">
          Nenhum pedido cadastrado.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                orders={orders.filter(
                  (order) => order.status === status
                )}
                disabled={updateStatus.isPending}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
