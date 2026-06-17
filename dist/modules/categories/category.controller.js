"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const category_model_1 = require("./category.model");
const sequelize_1 = require("sequelize");
const getAllCategories = async (req, res) => {
    try {
        const { search, // ?search=elektronik
        sortBy = "id", // ?sortBy=name
        order = "DESC", // ?order=ASC
        page = "1", limit = "20", } = req.query;
        // Güvenli sütun listesi (SQL injection'a karşı)
        const allowedSortFields = ["id", "name", "createdAt"];
        const safeSortBy = allowedSortFields.includes(String(sortBy))
            ? String(sortBy)
            : "id";
        const safeOrder = order === "ASC" ? "ASC" : "DESC";
        // Pagination
        const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
        const limitNum = Math.min(parseInt(String(limit), 10) || 20, 100);
        const offset = (pageNum - 1) * limitNum;
        // WHERE koşulu (search varsa uygula)
        const whereClause = search
            ? { name: { [sequelize_1.Op.iLike]: `%${search}%` } }
            : {};
        const { count, rows: categories } = await category_model_1.Category.findAndCountAll({
            where: whereClause,
            order: [[safeSortBy, safeOrder]],
            limit: limitNum,
            offset,
        });
        res.status(200).json({
            data: categories,
            total: count,
            page: pageNum,
            totalPages: Math.ceil(count / limitNum),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Categories could not be fetched", error });
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (req, res) => {
    try {
        const category = await category_model_1.Category.findByPk(Number(req.params.id));
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Category could not be fetched", error });
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (req, res) => {
    try {
        const { name_az, name_ru, name_en, is_active } = req.body;
        const category = await category_model_1.Category.create({
            name_az,
            name_ru,
            name_en,
            is_active,
        });
        res.status(201).json({
            message: "Category created successfully",
            category,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Category could not be created", error });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const category = await category_model_1.Category.findByPk(Number(req.params.id));
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const { name_az, name_ru, name_en, is_active } = req.body;
        await category.update({
            name_az,
            name_ru,
            name_en,
            is_active,
        });
        res.status(200).json({
            message: "Category updated successfully",
            category,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Category could not be updated", error });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const category = await category_model_1.Category.findByPk(Number(req.params.id));
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await category.destroy();
        res.status(200).json({
            message: "Category deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({ message: "Category could not be deleted", error });
    }
};
exports.deleteCategory = deleteCategory;
