import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import {
  PaymentAttributes,
  PaymentCreationAttributes,
  PaymentMethod,
  PaymentStatus,
} from "../types/payment.types";

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public method!: PaymentMethod;
  public status!: PaymentStatus;
  public transaction_id!: string | null;
  public order_id!: number;
  public paid_at!: Date | null;
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    method: {
      type: DataTypes.ENUM("card", "cash", "online"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },
    transaction_id: { type: DataTypes.STRING, allowNull: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    paid_at: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: "payments", timestamps: false }
);

export default Payment;