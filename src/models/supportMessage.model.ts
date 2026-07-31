import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  SupportMessageAttributes,
  SupportMessageCreationAttributes,
} from "../types/supportmessage.type";

class SupportMessage
  extends Model<
    SupportMessageAttributes,
    SupportMessageCreationAttributes
  >
  implements SupportMessageAttributes
{
  public id!: number;
  public ticketId!: number;
  public senderId!: number;
  public senderType!: "user" | "agent";
  public senderName!: string;
  public message!: string;
  public isRead!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

SupportMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderType: {
      type: DataTypes.ENUM("user", "agent"),
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "SupportMessage",
    tableName: "support_messages",
    underscored: true,
    timestamps: true,
  }
);

export default SupportMessage;