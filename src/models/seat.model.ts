import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  SeatAttributes,
  SeatCreationAttributes,
} from "../types/seat.type";

export class Seat
  extends Model<SeatAttributes, SeatCreationAttributes>
  implements SeatAttributes
{
  public id!: number;
  public seating_id!: number;
  public row!: string;
  public seat_number!: number;
}

Seat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seating_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    row: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seat_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "seats",
    timestamps: false,
  }
);

export default Seat;