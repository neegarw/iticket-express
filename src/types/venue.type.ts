import { Optional } from "sequelize";

export interface VenueAttributes {
  id: number;
  name: string;
}

export interface VenueCreationAttributes
  extends Optional<VenueAttributes, "id"> {}