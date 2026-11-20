import { api } from "../../../services/api";
import type { GuestCheckDTO } from "../dtos/guest-check.dto";

const ENDPOINT = "/guest-checks";

export const GuestCheckService = {
  async listAll(): Promise<GuestCheckDTO[]> {
    const response = await api.get<GuestCheckDTO[]>(ENDPOINT);
    return response.data;
  },

  async create(spotId: string): Promise<GuestCheckDTO> {
    const response = await api.post<GuestCheckDTO>(ENDPOINT, {
      spotId,
    });
    return response.data;
  },

  async close(id: string): Promise<GuestCheckDTO> {
    const response = await api.patch<GuestCheckDTO>(
      `${ENDPOINT}/${id}/close`,
    );
    return response.data;
  },
};