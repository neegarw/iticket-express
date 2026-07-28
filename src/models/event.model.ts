import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { EventAttributes, EventCreationAttributes } from "../types/event.type";

export class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public date!: Date;
  public sale_date_end!: Date;
  public category_id!: number;
  public venue_id!: number;
  public minimum_age!: number;
  public image_url!: string;
}

Event.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.DATE, allowNull: false },
    sale_date_end: { type: DataTypes.DATE, allowNull: false },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    venue_id: { type: DataTypes.INTEGER, allowNull: false },
    minimum_age: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image_url: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, tableName: "events", timestamps: false }
);

export default Event;