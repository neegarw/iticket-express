import { Request, Response } from "express";
import { EventSeat } from "../models/eventseat.model";
import { Event } from "../models/event.model";
import { Seat } from "../models/seat.model";
import { Seating } from "../models/seating.model";
import { Ticket } from "../models/ticket.model";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id, seat_id, status } = req.query;
    const where: any = {};
    if (event_id) where.event_id = event_id;
    if (seat_id) where.seat_id = seat_id;
    if (status) where.status = status;

    const eventSeats = await EventSeat.findAll({
      where,
      include: [{ model: Event }, { model: Seat, include: [{ model: Seating }] }],
    });
    respond(res, 200, { data: eventSeats });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventSeat = await EventSeat.findByPk(Number(req.params.id), {
      include: [{ model: Event }, { model: Seat, include: [{ model: Seating }] }],
    });
    if (!eventSeat) { respond(res, 404, { message: "Tapılmadı" }); return; }
    respond(res, 200, { data: eventSeat });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id, seat_id, price, status } = req.body;

    if (!price || price <= 0) {
      respond(res, 400, { message: "price müsbət ədəd olmalıdır" });
      return;
    }

    const event = await Event.findByPk(event_id);
    if (!event) { respond(res, 400, { message: `Event ID ${event_id} mövcud deyil` }); return; }

    const seat = await Seat.findByPk(seat_id);
    if (!seat) { respond(res, 400, { message: `Seat ID ${seat_id} mövcud deyil` }); return; }

    const seating = await Seating.findByPk(seat.seating_id);
    if (!seating) { respond(res, 400, { message: `Seat-in aid olduğu Seating tapılmadı` }); return; }

    if (seating.venue_id !== event.venue_id) {
      respond(res, 400, { message: `Bu yer, event-in keçirildiyi venue-ya aid deyil` });
      return;
    }

    const existing = await EventSeat.findOne({ where: { event_id, seat_id } });
    if (existing) {
      respond(res, 400, { message: `Bu yer artıq bu event üçün əlavə olunub` });
      return;
    }

    const eventSeat = await EventSeat.create({
      event_id,
      seat_id,
      price,
      status: status ?? "available",
    });
    respond(res, 201, { message: "EventSeat yaradıldı", data: eventSeat });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const bulkCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = req.body as {
      event_id: number;
      seat_id: number;
      price: number;
      status?: "available" | "reserved" | "sold";
    }[];

    if (!Array.isArray(items)) {
      respond(res, 400, { message: "Body array olmalıdır" });
      return;
    }

    for (const item of items) {
      if (!item.price || item.price <= 0) {
        respond(res, 400, { message: "price müsbət ədəd olmalıdır" });
        return;
      }

      const event = await Event.findByPk(item.event_id);
      if (!event) {
        respond(res, 400, { message: `Event ID ${item.event_id} mövcud deyil` });
        return;
      }

      const seat = await Seat.findByPk(item.seat_id);
      if (!seat) {
        respond(res, 400, { message: `Seat ID ${item.seat_id} mövcud deyil` });
        return;
      }

      const seating = await Seating.findByPk(seat.seating_id);
      if (!seating || seating.venue_id !== event.venue_id) {
        respond(res, 400, { message: `Seat ID ${item.seat_id}, Event ID ${item.event_id}-in venue-suna aid deyil` });
        return;
      }

      const existing = await EventSeat.findOne({
        where: { event_id: item.event_id, seat_id: item.seat_id },
      });
      if (existing) {
        respond(res, 400, {
          message: `Seat ID ${item.seat_id} artıq Event ID ${item.event_id} üçün əlavə olunub`,
        });
        return;
      }
    }

    const eventSeats = await EventSeat.bulkCreate(items, { validate: true });
    respond(res, 201, { message: "EventSeat-lər yaradıldı", data: eventSeats });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventSeat = await EventSeat.findByPk(Number(req.params.id));
    if (!eventSeat) { respond(res, 404, { message: "Tapılmadı" }); return; }

    const { event_id, seat_id, price, status } = req.body;

    if (eventSeat.status === "sold" && (event_id || seat_id)) {
      respond(res, 400, { message: "Satılmış EventSeat-in event/seat məlumatı dəyişdirilə bilməz" });
      return;
    }

    if (event_id) {
      const event = await Event.findByPk(event_id);
      if (!event) { respond(res, 400, { message: `Event ID ${event_id} mövcud deyil` }); return; }
    }

    if (seat_id) {
      const seat = await Seat.findByPk(seat_id);
      if (!seat) { respond(res, 400, { message: `Seat ID ${seat_id} mövcud deyil` }); return; }
    }

    if (price !== undefined && price <= 0) {
      respond(res, 400, { message: "price müsbət ədəd olmalıdır" });
      return;
    }

    await eventSeat.update({ event_id, seat_id, price, status });
    respond(res, 200, { message: "Yeniləndi", data: eventSeat });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventSeat = await EventSeat.findByPk(Number(req.params.id));
    if (!eventSeat) { respond(res, 404, { message: "Tapılmadı" }); return; }

    if (eventSeat.status === "sold") {
      respond(res, 400, { message: "Satılmış EventSeat silinə bilməz" });
      return;
    }

    const ticketCount = await Ticket.count({ where: { event_seat_id: eventSeat.id } });
    if (ticketCount > 0) {
      respond(res, 400, { message: "Bu EventSeat-ə bağlı bilet var, silinə bilməz" });
      return;
    }

    await eventSeat.destroy();
    respond(res, 200, { message: "Silindi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};