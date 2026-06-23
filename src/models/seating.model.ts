import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface SeatingsAttributes {
  id: number;
  name: string;
  count: number;
  venue_id: number;
}

interface SeatingsCreationAttributes extends Optional<SeatingsAttributes, "id"> {}

export class Seating
  extends Model<SeatingsAttributes, SeatingsCreationAttributes>
  implements SeatingsAttributes
{
  public id!: number;
  public name!: string;
  public count!: number;
  public venue_id!: number;
}

Seating.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    count: { type: DataTypes.INTEGER, allowNull: false },
    venue_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "seatings", timestamps: false }
);

export default Seating;
