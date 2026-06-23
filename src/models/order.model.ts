import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

interface OrderAttributes {
  id: number;
  date: Date;
  status: OrderStatus;
  total_price: number;
  seating_id: number;
  user_id: number;
  promocode_id?: number;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id" | "promocode_id"> {}

export class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public date!: Date;
  public status!: OrderStatus;
  public total_price!: number;
  public seating_id!: number;
  public user_id!: number;
  public promocode_id!: number;
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
    total_price: { type: DataTypes.INTEGER, allowNull: false },
    seating_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    promocode_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "orders", timestamps: false }
);

export default Order;
