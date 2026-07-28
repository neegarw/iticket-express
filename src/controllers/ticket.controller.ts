import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { EventSeat } from "../models/eventseat.model";
import { Order } from "../models/order.model";
import crypto from "crypto";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

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

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id), {
      include: [{ model: EventSeat }, { model: Order }],
    });
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }
    respond(res, 200, { data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_seat_id, order_id } = req.body;

    const eventSeat = await EventSeat.findByPk(event_seat_id);
    if (!eventSeat) {
      respond(res, 400, { message: `EventSeat ID ${event_seat_id} mövcud deyil` });
      return;
    }

    const order = await Order.findByPk(order_id);
    if (!order) {
      respond(res, 400, { message: `Order ID ${order_id} mövcud deyil` });
      return;
    }

    if (eventSeat.status === "sold") {
      respond(res, 400, { message: `Bu yer artıq satılıb` });
      return;
    }

    const existing = await Ticket.findOne({ where: { event_seat_id } });
    if (existing) {
      respond(res, 400, { message: `Bu EventSeat artıq bir biletə bağlıdır` });
      return;
    }

    const qr_code = crypto.randomUUID();
    const ticket = await Ticket.create({ event_seat_id, order_id, qr_code });

    await eventSeat.update({ status: "sold" });

    respond(res, 201, { message: "Bilet yaradıldı", data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const bulkCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = req.body as { event_seat_id: number; order_id: number }[];

    if (!Array.isArray(items)) {
      respond(res, 400, { message: "Body array olmalıdır" });
      return;
    }

    const eventSeatsToUpdate: EventSeat[] = [];

    for (const item of items) {
      const eventSeat = await EventSeat.findByPk(item.event_seat_id);
      if (!eventSeat) {
        respond(res, 400, { message: `EventSeat ID ${item.event_seat_id} mövcud deyil` });
        return;
      }

      if (eventSeat.status === "sold") {
        respond(res, 400, { message: `EventSeat ID ${item.event_seat_id} artıq satılıb` });
        return;
      }

      const order = await Order.findByPk(item.order_id);
      if (!order) {
        respond(res, 400, { message: `Order ID ${item.order_id} mövcud deyil` });
        return;
      }

      const existing = await Ticket.findOne({ where: { event_seat_id: item.event_seat_id } });
      if (existing) {
        respond(res, 400, { message: `EventSeat ID ${item.event_seat_id} artıq bir biletə bağlıdır` });
        return;
      }

      eventSeatsToUpdate.push(eventSeat);
    }

    const withQr = items.map((item) => ({
      ...item,
      qr_code: crypto.randomUUID(),
    }));

    const tickets = await Ticket.bulkCreate(withQr, { validate: true });

    for (const seat of eventSeatsToUpdate) {
      await seat.update({ status: "sold" });
    }

    respond(res, 201, { message: "Biletlər yaradıldı", data: tickets });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id));
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }

    if (req.body.event_seat_id || req.body.order_id) {
      respond(res, 400, { message: "event_seat_id və order_id dəyişdirilə bilməz" });
      return;
    }

    await ticket.update(req.body);
    respond(res, 200, { message: "Yeniləndi", data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id));
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }

    const eventSeat = await EventSeat.findByPk(ticket.event_seat_id);

    await ticket.destroy();

    if (eventSeat) {
      await eventSeat.update({ status: "available" });
    }

    respond(res, 200, { message: "Silindi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};