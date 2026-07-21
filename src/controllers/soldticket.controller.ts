import { Request, Response } from "express";
import { SoldTicket } from "../models/soldticket.model";
import { Ticket } from "../models/ticket.model";
import { Order } from "../models/order.model";
import { Seating } from "../models/seating.model";
import { Event } from "../models/event.model";

export const getAll = async (req: Request, res: Response) => {
  try {
    const {
      sortBy = "id",
      order = "DESC",
      page = "1",
      limit = "20",
      ticket_id,
      order_id,
    } = req.query;

    const allowedSortFields = [
      "id",
      "seating_number",
      "sold_price",
      "ticket_id",
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

    const where: any = {};
    if (ticket_id) where.ticket_id = ticket_id;
    if (order_id) where.order_id = order_id;

    const { count, rows } = await SoldTicket.findAndCountAll({
      where,
      order: [[safeSortBy, safeOrder]],
      limit: limitNum,
      offset,
      include: [
        { model: Ticket, include: [{ model: Seating }, { model: Event }] },
        { model: Order },
      ],
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
    const soldTicket = await SoldTicket.findByPk(Number(req.params.id), {
      include: [
        { model: Ticket, include: [{ model: Seating }, { model: Event }] },
        { model: Order },
      ],
    });

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
    const { seating_number, sold_price, ticket_id, order_id } = req.body;

    const ticket = await Ticket.findByPk(ticket_id);
    if (!ticket) {
      return res.status(400).json({
        message: `Ticket ID ${ticket_id} mövcud deyil`,
      });
    }

    const order = await Order.findByPk(order_id);
    if (!order) {
      return res.status(400).json({
        message: `Order ID ${order_id} mövcud deyil`,
      });
    }

    // Eyni ticket üçün eyni seating_number artıq satılıbmı?
    const existing = await SoldTicket.findOne({
      where: { ticket_id, seating_number },
    });
    if (existing) {
      return res.status(400).json({
        message: `Bu seating_number (${seating_number}) artıq bu bilet üçün satılıb`,
      });
    }

    const soldTicket = await SoldTicket.create({
      seating_number,
      sold_price,
      ticket_id,
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

    const { seating_number, sold_price, ticket_id, order_id } = req.body;

    const finalTicketId = ticket_id ?? soldTicket.ticket_id;
    const finalOrderId = order_id ?? soldTicket.order_id;
    const finalSeatingNumber = seating_number ?? soldTicket.seating_number;

    const ticket = await Ticket.findByPk(finalTicketId);
    if (!ticket) {
      return res.status(400).json({
        message: `Ticket ID ${finalTicketId} mövcud deyil`,
      });
    }

    const order = await Order.findByPk(finalOrderId);
    if (!order) {
      return res.status(400).json({
        message: `Order ID ${finalOrderId} mövcud deyil`,
      });
    }

    const existing = await SoldTicket.findOne({
      where: { ticket_id: finalTicketId, seating_number: finalSeatingNumber },
    });
    if (existing && existing.id !== soldTicket.id) {
      return res.status(400).json({
        message: `Bu seating_number (${finalSeatingNumber}) artıq bu bilet üçün satılıb`,
      });
    }

    await soldTicket.update({
      seating_number: finalSeatingNumber,
      sold_price,
      ticket_id: finalTicketId,
      order_id: finalOrderId,
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