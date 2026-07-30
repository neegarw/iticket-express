import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class SupportMessage extends Model {
  public id!: number;
  public ticketId!: number;
  public senderId!: number;
  public senderType!: "user" | "agent";
  public senderName!: string;   // YENİ
  public message!: string;
  public isRead!: boolean;
}

SupportMessage.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ticketId: { type: DataTypes.INTEGER, allowNull: false },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    senderType: { type: DataTypes.ENUM("user", "agent"), allowNull: false },
    senderName: { type: DataTypes.STRING, allowNull: false },   // YENİ
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "SupportMessage", tableName: "support_messages" }
);

export default SupportMessage;