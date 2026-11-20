
import { api } from "../../../services/api";
import type { SpotDTO } from "../dtos/spot.dto";

const ENDPOINT = "/spots";

export const SpotService = {
  async listAll(): Promise<SpotDTO[]> {
    const response = await api.get<SpotDTO[]>(ENDPOINT);
    return response.data;
  },

  async findOne(id: string): Promise<SpotDTO> {
    const response = await api.get<SpotDTO>(`${ENDPOINT}/${id}`);
    return response.data;
  },
};
