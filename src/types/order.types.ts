import { Optional } from "sequelize";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export interface OrderAttributes {
  id: number;
  date: Date;
  status: OrderStatus;
  total_price: number;
  user_id: number;
  promocode_id: number | null;
}

export interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "date" | "status" | "total_price" | "promocode_id"> {}