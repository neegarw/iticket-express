import { Request, Response } from "express";
import { SoldTicket } from "../models/soldticket.model";

export const getAll = async (req: Request, res: Response) => {
  try {
    const {
      sortBy = "id",
      order = "DESC",
      page = "1",
      limit = "20",
    } = req.query;

    const allowedSortFields = [
      "id",
      "seating_number",
      "sold_price",
      "seating_id",
      "order_id",
    ];

    const safeSortBy = allowedSortFields.includes(String(sortBy))
      ? String(sortBy)
      : "id";

    const safeOrder =
      String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
    const limitNum = Math.min(parseInt(String(limit), 10) || 20, 100);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await SoldTicket.findAndCountAll({
      order: [[safeSortBy, safeOrder]],
      limit: limitNum,
      offset,
    });

    res.status(200).json({
      data: rows,
      total: count,
      page: pageNum,
      totalPages: Math.ceil(count / limitNum),
    });
  } catch (error) {
    res.status(500).json({
      message: "Sold tickets could not be fetched",
      error,
    });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const soldTicket = await SoldTicket.findByPk(Number(req.params.id));

    if (!soldTicket) {
      return res.status(404).json({
        message: "Sold ticket not found",
      });
    }

    res.status(200).json(soldTicket);
  } catch (error) {
    res.status(500).json({
      message: "Sold ticket could not be fetched",
      error,
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const {
      seating_number,
      sold_price,
      seating_id,
      order_id,
    } = req.body;

    const soldTicket = await SoldTicket.create({
      seating_number,
      sold_price,
      seating_id,
      order_id,
    });

    res.status(201).json({
      message: "Sold ticket created successfully",
      soldTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Sold ticket could not be created",
      error,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const soldTicket = await SoldTicket.findByPk(Number(req.params.id));

    if (!soldTicket) {
      return res.status(404).json({
        message: "Sold ticket not found",
      });
    }

    const {
      seating_number,
      sold_price,
      seating_id,
      order_id,
    } = req.body;

    await soldTicket.update({
      seating_number,
      sold_price,
      seating_id,
      order_id,
    });

    res.status(200).json({
      message: "Sold ticket updated successfully",
      soldTicket,
    });
  } catch (error) {
    res.status(500).json({
      message: "Sold ticket could not be updated",
      error,
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const soldTicket = await SoldTicket.findByPk(Number(req.params.id));

    if (!soldTicket) {
      return res.status(404).json({
        message: "Sold ticket not found",
      });
    }

    await soldTicket.destroy();

    res.status(200).json({
      message: "Sold ticket deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Sold ticket could not be deleted",
      error,
    });
  }
};