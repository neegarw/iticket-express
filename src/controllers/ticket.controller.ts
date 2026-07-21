import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { Seating } from "../models/seating.model";
import { Venue } from "../models/venue.model";
import { Event } from "../models/event.model";
import { SoldTicket } from "../models";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seating_id, venue_id } = req.query;
    const where: any = {};
    if (seating_id) where.seating_id = seating_id;
    if (venue_id) where.venue_id = venue_id;
    const tickets = await Ticket.findAll({
      where,
      include: [{ model: Seating }, { model: Venue }, { model: Event }],
    });
    respond(res, 200, { data: tickets });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id), {
      include: [{ model: Seating }, { model: Venue }, { model: Event }],
    });
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }
    respond(res, 200, { data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { price, seating_id, venue_id, event_id } = req.body;

    const seating = await Seating.findByPk(seating_id);
    if (!seating) { respond(res, 400, { message: `Seating ID ${seating_id} mövcud deyil` }); return; }

    const venue = await Venue.findByPk(venue_id);
    if (!venue) { respond(res, 400, { message: `Venue ID ${venue_id} mövcud deyil` }); return; }

    const event = await Event.findByPk(event_id);
    if (!event) { respond(res, 400, { message: `Event ID ${event_id} mövcud deyil` }); return; }

    if (seating.venue_id !== venue_id) {
      respond(res, 400, { message: `Seating ID ${seating_id} bu venue-ya aid deyil` });
      return;
    }
    if (event.venue_id !== venue_id) {
      respond(res, 400, { message: `Event ID ${event_id} bu venue-da keçirilmir` });
      return;
    }
    const ticket = await Ticket.create({ price, seating_id, venue_id, event_id });
    respond(res, 201, { message: "Bilet yaradıldı", data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const bulkCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = req.body as { price: number; seating_id: number; venue_id: number; event_id: number }[];

    for (const item of items) {
      const seating = await Seating.findByPk(item.seating_id);
      if (!seating) { respond(res, 400, { message: `Seating ID ${item.seating_id} mövcud deyil` }); return; }

      const venue = await Venue.findByPk(item.venue_id);
      if (!venue) { respond(res, 400, { message: `Venue ID ${item.venue_id} mövcud deyil` }); return; }

      const event = await Event.findByPk(item.event_id);
      if (!event) { respond(res, 400, { message: `Event ID ${item.event_id} mövcud deyil` }); return; }

      if (seating.venue_id !== item.venue_id) {
        respond(res, 400, { message: `Seating ID ${item.seating_id} bu venue-ya aid deyil` });
        return;
      }
      if (event.venue_id !== item.venue_id) {
        respond(res, 400, { message: `Event ID ${item.event_id} bu venue-da keçirilmir` });
        return;
      }
    }

    const tickets = await Ticket.bulkCreate(items, { validate: true });
    respond(res, 201, { message: "Biletlər yaradıldı", data: tickets });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id));
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }

    const seating_id = req.body.seating_id ?? ticket.seating_id;
    const venue_id = req.body.venue_id ?? ticket.venue_id;
    const event_id = req.body.event_id ?? ticket.event_id;

    const seating = await Seating.findByPk(seating_id);
    if (!seating) { respond(res, 400, { message: `Seating ID ${seating_id} mövcud deyil` }); return; }

    const venue = await Venue.findByPk(venue_id);
    if (!venue) { respond(res, 400, { message: `Venue ID ${venue_id} mövcud deyil` }); return; }

    const event = await Event.findByPk(event_id);
    if (!event) { respond(res, 400, { message: `Event ID ${event_id} mövcud deyil` }); return; }

    if (seating.venue_id !== venue_id) {
      respond(res, 400, { message: `Seating ID ${seating_id} bu venue-ya aid deyil` });
      return;
    }
    if (event.venue_id !== venue_id) {
      respond(res, 400, { message: `Event ID ${event_id} bu venue-da keçirilmir` });
      return;
    }

    await ticket.update({ ...req.body, seating_id, venue_id, event_id });
    respond(res, 200, { message: "Yeniləndi", data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id));
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }

    const soldCount = await SoldTicket.count({ where: { ticket_id: ticket.id } });
    if (soldCount > 0) {
      respond(res, 400, { message: "Bu bilet artıq satılıb, silinə bilməz" });
      return;
    }

    await ticket.destroy();
    respond(res, 200, { message: "Silindi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};
