import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { CategoryAttributes, CategoryCreationAttributes } from "../types/category.type";

export class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name_az!: string;
  public name_ru!: string;
  public name_en!: string;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name_az: { type: DataTypes.STRING, allowNull: false },
    name_ru: { type: DataTypes.STRING, allowNull: false },
    name_en: { type: DataTypes.STRING, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    sequelize,
    tableName: "categories",
    modelName: "Category",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Category;