import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import User from "./user.model";
import Permission from "./permission.model";

export interface AdminPermissionAttributes {
  id: number;
  adminId: number;      // icazə verilən admin
  permissionId: number; // hansı icazə
  grantedBy: number;    // superadmin-in id-si
}

export interface AdminPermissionCreationAttributes
  extends Optional<AdminPermissionAttributes, "id"> {}

class AdminPermission
  extends Model<AdminPermissionAttributes, AdminPermissionCreationAttributes>
  implements AdminPermissionAttributes
{
  public id!: number;
  public adminId!: number;
  public permissionId!: number;
  public grantedBy!: number;
}

AdminPermission.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
      onDelete: "CASCADE",
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "permissions", key: "id" },
      onDelete: "CASCADE",
    },
    grantedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    tableName: "admin_permissions",
    modelName: "AdminPermission",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["adminId", "permissionId"] }, // duplicate olmasm
    ],
  }
);

export default AdminPermission;
