import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  SoldTicketAttributes,
  SoldTicketCreationAttributes,
} from "../types/soldticket.types";

export class SoldTicket
  extends Model<SoldTicketAttributes, SoldTicketCreationAttributes>
  implements SoldTicketAttributes
{
  public id!: number;
  public seating_number!: number;
  public sold_price!: number;
  public order_id!: number;
  public ticket_id!: number;
}

SoldTicket.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    seating_number: { type: DataTypes.INTEGER, allowNull: false },
    sold_price: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    ticket_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "sold_tickets", timestamps: false }
);

export default SoldTicket;