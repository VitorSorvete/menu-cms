
export interface ProductDTO {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  picture?: string | null;
  active: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
}
