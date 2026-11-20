import { api } from "../../../services/api";
import type { CategoryDTO } from "../dtos/category.dto";

const ENDPOINT = "/categories";

export const CategoryService = {
  async listAll(): Promise<CategoryDTO[]> {
    const response = await api.get<CategoryDTO[]>(ENDPOINT);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};