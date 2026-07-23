import { Optional } from "sequelize";

export interface SoldTicketAttributes {
  id: number;
  seating_number: number;
  sold_price: number;
  order_id: number;
  ticket_id: number;
}

export interface SoldTicketCreationAttributes
  extends Optional<SoldTicketAttributes, "id"> {}