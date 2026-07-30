import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { EventSeat } from "../models/eventseat.model";
import { Order } from "../models/order.model";
import { AuthRequest } from "../middlewares/auth.middleware";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

// İstifadəçinin öz biletləri (öz order-ləri üzərindən)
export const getMyTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user!.id, status: "confirmed" },
      attributes: ["id"],
    });
    const orderIds = orders.map((o) => o.id);

    const tickets = await Ticket.findAll({
      where: { order_id: orderIds },
      include: [{ model: EventSeat }, { model: Order }],
    });
    respond(res, 200, { data: tickets });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id), {
      include: [{ model: EventSeat }, { model: Order }],
    });
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }

    // Yalnız öz biletini görə bilsin (admin deyilsə)
    const order = await Order.findByPk(ticket.order_id);
    if (order?.user_id !== req.user!.id) {
      respond(res, 403, { message: "Bu biletə baxmağa icazəniz yoxdur" });
      return;
    }

    respond(res, 200, { data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

// Admin: bütün biletlər
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_id, event_seat_id } = req.query;
    const where: any = {};
    if (order_id) where.order_id = order_id;
    if (event_seat_id) where.event_seat_id = event_seat_id;

    const tickets = await Ticket.findAll({
      where,
      include: [{ model: EventSeat }, { model: Order }],
    });
    respond(res, 200, { data: tickets });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

// QR kod ilə bileti doğrula (giriş qapısında skan üçün)
export const verifyByQr = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qr_code } = req.body;
    if (!qr_code) { respond(res, 400, { message: "qr_code mütləqdir" }); return; }

    const ticket = await Ticket.findOne({
      where: { qr_code },
      include: [{ model: EventSeat }, { model: Order }],
    });

    if (!ticket) { respond(res, 404, { message: "Bilet tapılmadı" }); return; }

    const order = await Order.findByPk(ticket.order_id);
    if (order?.status !== "confirmed") {
      respond(res, 400, { message: "Bu bilet üçün ödəniş təsdiqlənməyib" });
      return;
    }

    respond(res, 200, { message: "Bilet etibarlıdır", data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};