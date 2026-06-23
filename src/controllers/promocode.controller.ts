import { Request, Response } from "express";
import { Ticket } from "../models/ticket.model";
import { Seating } from "../models/seating.model";
import { Venue } from "../models/venue.model";
import { PromoCode } from "../models";

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
      include: [{ model: Seating }, { model: Venue }],
    });
    respond(res, 200, { data: tickets });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id), {
      include: [{ model: Seating }, { model: Venue }],
    });
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }
    respond(res, 200, { data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { price, seating_id, venue_id } = req.body;
    const seating = await Seating.findByPk(seating_id);
    if (!seating) { respond(res, 400, { message: `Seating ID ${seating_id} mövcud deyil` }); return; }
    const venue = await Venue.findByPk(venue_id);
    if (!venue) { respond(res, 400, { message: `Venue ID ${venue_id} mövcud deyil` }); return; }
    const ticket = await Ticket.create({ price, seating_id, venue_id });
    respond(res, 201, { message: "Bilet yaradıldı", data: ticket });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const bulkCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const promos = await PromoCode.bulkCreate(req.body, { validate: true });
    respond(res, 201, { message: "Promo kodlar yaradıldı", data: promos });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findByPk(Number(req.params.id));
    if (!ticket) { respond(res, 404, { message: "Tapılmadı" }); return; }
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
    await ticket.destroy();
    respond(res, 200, { message: "Silindi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const validateCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, event_id } = req.body;
    const promo = await PromoCode.findOne({ where: { code, event_id } });
    if (!promo) { respond(res, 404, { message: "Promo kod tapılmadı" }); return; }
    if (new Date() > promo.expiry_date) {
      respond(res, 400, { message: "Promo kodun müddəti bitib" });
      return;
    }
    respond(res, 200, { data: { percentage: promo.percentage, valid: true } });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};
