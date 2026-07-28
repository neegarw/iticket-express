import { Optional } from "sequelize";

export interface SeatingAttributes {
  id: number;
  name: string;
  venue_id: number;
}

export interface SeatingCreationAttributes
  extends Optional<SeatingAttributes, "id"> {}