import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  TicketAttributes,
  TicketCreationAttributes,
} from "../types/ticket.type";

export class Ticket
  extends Model<TicketAttributes, TicketCreationAttributes>
  implements TicketAttributes
{
  public id!: number;
  public event_seat_id!: number;
  public order_id!: number;
  public qr_code!: string;
}

Ticket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    event_seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    qr_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "tickets",
    timestamps: false,
  }
);

export default Ticket;