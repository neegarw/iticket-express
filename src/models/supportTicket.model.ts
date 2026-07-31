import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  SupportTicketAttributes,
  SupportTicketCreationAttributes,
} from "../types/supportticket.type";

class SupportTicket
  extends Model<
    SupportTicketAttributes,
    SupportTicketCreationAttributes
  >
  implements SupportTicketAttributes
{
  public id!: number;
  public userId!: number;
  public subject!: string;
  public status!: "open" | "resolved" | "closed";
  public rating!: number | null;
  public ratingComment!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SupportTicket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("open", "resolved", "closed"),
      defaultValue: "open",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ratingComment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "SupportTicket",
    tableName: "support_tickets",
    underscored: true,
    timestamps: true,
  }
);

export default SupportTicket;