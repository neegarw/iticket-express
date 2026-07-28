import { Optional } from "sequelize";

export interface EventSeatAttributes {
  id: number;
  event_id: number;
  seat_id: number;
  price: number;
  status: "available" | "sold";
}

export interface EventSeatCreationAttributes
  extends Optional<EventSeatAttributes, "id" | "status"> {}