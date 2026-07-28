import { Optional } from "sequelize";

export interface EventAttributes {
  id: number;
  name: string;
  description: string;
  date: Date;
  sale_date_end: Date;
  category_id: number;
  venue_id: number;
  minimum_age: number;
  image_url: string;
}

export interface EventCreationAttributes
  extends Optional<EventAttributes, "id" | "minimum_age"> {}