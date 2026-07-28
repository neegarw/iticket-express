import { Optional } from "sequelize";

export interface SeatAttributes {
  id: number;
  seating_id: number;
  row: string;
  seat_number: number;
}

export interface SeatCreationAttributes
  extends Optional<SeatAttributes, "id"> {}