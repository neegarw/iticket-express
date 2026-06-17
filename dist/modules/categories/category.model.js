"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
// src/models/category.model.ts
const sequelize_1 = require("sequelize");
const db_1 = require("../../config/db");
class Category extends sequelize_1.Model {
}
exports.Category = Category;
Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name_az: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name_ru: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name_en: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "categories",
    modelName: "Category",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
exports.default = Category;
