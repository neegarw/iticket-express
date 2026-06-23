import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface SoldTicketAttributes {
  id: number;
  seating_number: number;
  sold_price: number;
  seating_id: number;
  order_id: number;
}

interface SoldTicketCreationAttributes extends Optional<SoldTicketAttributes, "id"> {}

export class SoldTicket
  extends Model<SoldTicketAttributes, SoldTicketCreationAttributes>
  implements SoldTicketAttributes
{
  public id!: number;
  public seating_number!: number;
  public sold_price!: number;
  public seating_id!: number;
  public order_id!: number;
}

SoldTicket.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    seating_number: { type: DataTypes.INTEGER, allowNull: false },
    sold_price: { type: DataTypes.INTEGER, allowNull: false },
    seating_id: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, tableName: "sold_tickets", timestamps: false }
);

export default SoldTicket;
