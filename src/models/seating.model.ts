import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { SeatingAttributes, SeatingCreationAttributes } from "../types/seating.type";

export class Seating
  extends Model<SeatingAttributes, SeatingCreationAttributes>
  implements SeatingAttributes
{
  public id!: number;
  public name!: string;
  public venue_id!: number;
}

Seating.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    venue_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "seatings", timestamps: false }
);

export default Seating;