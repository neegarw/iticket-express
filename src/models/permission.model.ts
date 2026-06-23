import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

// Mövcud bütün icazələr
export type PermissionKey =
  | "create_event"
  | "edit_event"
  | "delete_event"
  | "create_venue"
  | "edit_venue"
  | "delete_venue"
  | "create_category"
  | "edit_category"
  | "delete_category"
  | "manage_seats"
  | "manage_tickets"
  | "manage_orders"
  | "manage_promocodes"
  | "manage_users"
  | "view_payments"
  | "manage_support";

export interface PermissionAttributes {
  id: number;
  key: PermissionKey;
  description?: string;
}

export interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, "id" | "description"> {}

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  public id!: number;
  public key!: PermissionKey;
  public description!: string;
}

Permission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    key: {
      type: DataTypes.ENUM(
        "create_event", "edit_event", "delete_event",
        "create_venue", "edit_venue", "delete_venue",
        "create_category", "edit_category", "delete_category",
        "manage_seats", "manage_tickets", "manage_orders",
        "manage_promocodes", "manage_users", "view_payments",
        "manage_support"
      ),
      allowNull: false,
      unique: true,
    },
    description: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    sequelize,
    tableName: "permissions",
    modelName: "Permission",
    timestamps: false,
  }
);

export default Permission;
