import { Optional } from "sequelize";

export interface PromoCodeAttributes {
  id: number;
  code: string;
  percentage: number;
  max_discount: number;
  expiry_date: Date;
  event_id: number | null; // null = bütün event-lərə tətbiq olunur
}

export interface PromoCodeCreationAttributes
  extends Optional<PromoCodeAttributes, "id" | "event_id"> {}