import { Optional } from "sequelize";

export interface TicketAttributes {
  id: number;
  price: number;
  seating_id: number;
  event_id: number;
}

export interface TicketCreationAttributes
  extends Optional<TicketAttributes, "id"> {}