
export interface OrderDTO {
  id: string;
  createdAt: string;
  total: number | string;
  status: "NEW" | "PREPARING" | "READY" | "DELIVERED";

  guestCheck: {
    id: string;
    status: "OPENED" | "CLOSED";
    spot: {
      id: string;
      name: string;
    };
  };

  items: {
    id: string;
    quantity: number;
    price: number | string;
    subtotal: number | string;
    product: {
      id: string;
      name: string;
      picture?: string;
      price: number | string;
    };
  }[];
}
