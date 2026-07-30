import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db"; // sizdə hansı adla ixrac olunubsa

class SupportTicket extends Model {
  public id!: number;
  public userId!: number;
  public subject!: string;
  public status!: "open" | "resolved" | "closed";
  public rating!: number | null;
  public ratingComment!: string | null;
}

SupportTicket.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("open", "resolved", "closed"),
      defaultValue: "open",
    },
    rating: { type: DataTypes.INTEGER, allowNull: true },           // YENİ, 1-5
    ratingComment: { type: DataTypes.TEXT, allowNull: true },       // YENİ
  },
  { sequelize, modelName: "SupportTicket", tableName: "support_tickets" }
);

export default SupportTicket;