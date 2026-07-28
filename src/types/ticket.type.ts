import { Optional } from "sequelize";

export interface TicketAttributes {
  id: number;
  event_seat_id: number;
  order_id: number;
  qr_code: string;
}

export interface TicketCreationAttributes
  extends Optional<TicketAttributes, "id" | "qr_code"> {}