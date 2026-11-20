
import { api } from "../../../services/api";
import type { OrderDTO } from "../dtos/order.dto";

const ENDPOINT = "/orders";

export const OrderService = {
  async listAll(): Promise<OrderDTO[]> {
    const response = await api.get<OrderDTO[]>(ENDPOINT);
    return response.data;
  },

  async updateStatus(
    id: string,
    status: OrderDTO["status"],
  ): Promise<OrderDTO> {
    const response = await api.patch<OrderDTO>(
      `${ENDPOINT}/${id}/status`,
      { status },
    );

    return response.data;
  },
};
