import { Optional } from "sequelize";

export type PaymentMethod = "card" | "cash" | "online";
export type PaymentStatus = "pending" | "success" | "failed";

export interface PaymentAttributes {
  id: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id: string | null;
  order_id: number;
  paid_at: Date | null;
}

export interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, "id" | "status" | "transaction_id" | "paid_at"> {}