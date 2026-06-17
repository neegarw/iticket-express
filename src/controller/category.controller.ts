import { Request, Response } from "express";
import { Category } from "../models/category.model";
import { Op } from "sequelize";


export const getAll = async (req: Request, res: Response) => {
    try {
        const {
            search,
            sortBy = "id",
            order = "DESC",
            page = "1",
            limit = "20",
        } = req.query;

        const allowedSortFields = ["id", "name_az", "name_ru", "name_en", "created_at"];

        const safeSortBy = allowedSortFields.includes(String(sortBy))
            ? String(sortBy)
            : "id";

        const safeOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

        const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
        const limitNum = Math.min(parseInt(String(limit), 10) || 20, 100);
        const offset = (pageNum - 1) * limitNum;

        const whereClause = search
            ? {
                [Op.or]: [
                    {
                        name_az: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        name_ru: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        name_en: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            }
            : {};

        const { count, rows: categories } = await Category.findAndCountAll({
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
    } catch (error) {
        res.status(500).json({
            message: "Categories could not be fetched",
            error,
        });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(Number(req.params.id));
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Category could not be fetched", error });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { name_az, name_ru, name_en, is_active } = req.body;

        const category = await Category.create({
            name_az,
            name_ru,
            name_en,
            is_active,
        });

        res.status(201).json({
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        res.status(500).json({ message: "Category could not be created", error });
    }
};

export const bulkCreateCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.bulkCreate(req.body, {
      validate: true,
    });

    res.status(201).json(categories);
  } catch (error) {
    res.status(500).json({
      message: (error as Error).message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(Number(req.params.id));

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
    } catch (error) {
        res.status(500).json({ message: "Category could not be updated", error });
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByPk(Number(req.params.id));
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await category.destroy();
        res.status(200).json({
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Category could not be deleted", error });
    }
};