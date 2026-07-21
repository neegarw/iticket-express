import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface SoldTicketAttributes {
  id: number;
  seating_number: number;
  sold_price: number;
  order_id: number;
  ticket_id?: number; // Optional property for the foreign key to Ticket
}

interface SoldTicketCreationAttributes extends Optional<SoldTicketAttributes, "id"> {}

export class SoldTicket
  extends Model<SoldTicketAttributes, SoldTicketCreationAttributes>
  implements SoldTicketAttributes
{
  public id!: number;
  public seating_number!: number;
  public sold_price!: number;
  public order_id!: number;
  public ticket_id?: number; // Optional property for the foreign key to Ticket
}

SoldTicket.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    seating_number: { type: DataTypes.INTEGER, allowNull: false },
    sold_price: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    ticket_id: { type: DataTypes.INTEGER, allowNull: true }, // Optional foreign key to Ticket
  },
  { sequelize, tableName: "sold_tickets", timestamps: false }
);

export default SoldTicket;
