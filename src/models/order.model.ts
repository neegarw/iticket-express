// src/models/order.model.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { OrderAttributes, OrderCreationAttributes, OrderStatus } from "../types/order.types";

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public date!: Date;
  public status!: OrderStatus;
  public total_price!: number;
  public user_id!: number;
  public promocode_id!: number | null;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    total_price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    promocode_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "orders", timestamps: false }
);

export default Order;