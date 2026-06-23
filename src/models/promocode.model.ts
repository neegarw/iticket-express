import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface PromoCodeAttributes {
  id: number;
  code: string;
  percentage: number;
  expiry_date: Date;
  event_id: number;
}

interface PromoCodeCreationAttributes extends Optional<PromoCodeAttributes, "id"> {}

export class PromoCode
  extends Model<PromoCodeAttributes, PromoCodeCreationAttributes>
  implements PromoCodeAttributes
{
  public id!: number;
  public code!: string;
  public percentage!: number;
  public expiry_date!: Date;
  public event_id!: number;
}

PromoCode.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    percentage: { type: DataTypes.INTEGER, allowNull: false },
    expiry_date: { type: DataTypes.DATE, allowNull: false },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "promo_codes", timestamps: false }
);

export default PromoCode;
