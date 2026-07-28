import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  EventSeatAttributes,
  EventSeatCreationAttributes,
} from "../types/eventseat.type";

export class EventSeat
  extends Model<EventSeatAttributes, EventSeatCreationAttributes>
  implements EventSeatAttributes
{
  public id!: number;
  public event_id!: number;
  public seat_id!: number;
  public price!: number;
  public status!: "available" | "sold";
}

EventSeat.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    seat_id: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("available", "sold"),
      allowNull: false,
      defaultValue: "available",
    },
  },
  {
    sequelize,
    tableName: "event_seats",
    timestamps: false,
    indexes: [{ unique: true, fields: ["event_id", "seat_id"] }],
  }
);

export default EventSeat;