import { Optional } from "sequelize";

export interface CategoryAttributes {
  id: number;
  name_az: string;
  name_ru: string;
  name_en: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "is_active" | "created_at" | "updated_at"> {}