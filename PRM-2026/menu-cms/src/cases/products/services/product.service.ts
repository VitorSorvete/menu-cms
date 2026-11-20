import { api } from "../../../services/api";
import type { ProductDTO } from "../dtos/product.dto";

const ENDPOINT = "/products";

export const ProductService = {
  async listAll(categoryId?: string): Promise<ProductDTO[]> {
    const response = await api.get<ProductDTO[]>(ENDPOINT, {
      params: categoryId ? { categoryId } : {},
    });

    return response.data;
  },

  async findOne(id: string): Promise<ProductDTO> {
    const response = await api.get<ProductDTO>(`${ENDPOINT}/${id}`);
    return response.data;
  },
};
