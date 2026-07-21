import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface TicketAttributes {
  id: number;
  price: number;
  seating_id: number;
  venue_id: number;
  event_id?: number;
}

interface TicketCreationAttributes extends Optional<TicketAttributes, "id"> {}

export class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  public id!: number;
  public price!: number;
  public seating_id!: number;
  public venue_id!: number;
  public event_id?: number;
}

Ticket.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    seating_id: { type: DataTypes.INTEGER, allowNull: false },
    venue_id: { type: DataTypes.INTEGER, allowNull: false },
    event_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "tickets", timestamps: false }
);

export default Ticket;
