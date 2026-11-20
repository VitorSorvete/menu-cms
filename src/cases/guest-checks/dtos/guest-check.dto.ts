export interface GuestCheckDTO {
  id: string;
  createdAt: string;
  status: "OPENED" | "CLOSED";
  spot: {
    id: string;
    name: string;
    active: boolean;
  };
}