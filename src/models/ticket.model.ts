import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { TicketAttributes, TicketCreationAttributes } from "../types/ticket.types";

export class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  public id!: number;
  public price!: number;
  public seating_id!: number;
  public event_id!: number;
}

Ticket.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    seating_id: { type: DataTypes.INTEGER, allowNull: false },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "tickets", timestamps: false }
);

export default Ticket;