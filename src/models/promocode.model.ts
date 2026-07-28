// src/models/promocode.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { PromoCodeAttributes, PromoCodeCreationAttributes } from "../types/promocode.type";

export class PromoCode
  extends Model<PromoCodeAttributes, PromoCodeCreationAttributes>
  implements PromoCodeAttributes
{
  public id!: number;
  public code!: string;
  public percentage!: number;
  public max_discount!: number;
  public expiry_date!: Date;
  public event_id!: number | null;
}

PromoCode.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    percentage: { type: DataTypes.INTEGER, allowNull: false },
    max_discount: { type: DataTypes.INTEGER, allowNull: false },
    expiry_date: { type: DataTypes.DATE, allowNull: false },
    event_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "promo_codes", timestamps: false }
);

export default PromoCode;