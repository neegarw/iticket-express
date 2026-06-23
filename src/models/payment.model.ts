import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type PaymentMethod = "card" | "cash" | "online";
export type PaymentStatus = "pending" | "success" | "failed";

interface PaymentAttributes {
  id: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  order_id: number;
  paid_at?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id" | "transaction_id" | "paid_at"> {}

export class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public method!: PaymentMethod;
  public status!: PaymentStatus;
  public transaction_id!: string;
  public order_id!: number;
  public paid_at!: Date;
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
