import { Request, Response } from "express";
import { Seating } from "../models/seating.model";
import { Venue } from "../models/venue.model";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { venue_id } = req.query;
    const where: any = {};
    if (venue_id) where.venue_id = venue_id;
    const seatings = await Seating.findAll({ where, include: [{ model: Venue }] });
    respond(res, 200, { data: seatings });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const seating = await Seating.findByPk(Number(req.params.id), {
      include: [{ model: Venue }],
    });
    if (!seating) { respond(res, 404, { message: "Tapılmadı" }); return; }
    respond(res, 200, { data: seating });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, count, venue_id } = req.body;
    const venue = await Venue.findByPk(venue_id);
    if (!venue) { respond(res, 400, { message: `Venue ID ${venue_id} mövcud deyil` }); return; }
    const seating = await Seating.create({ name, count, venue_id });
    respond(res, 201, { message: "Oturacaq yaradıldı", data: seating });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const seating = await Seating.findByPk(Number(req.params.id));
    if (!seating) { respond(res, 404, { message: "Tapılmadı" }); return; }
    await seating.update(req.body);
    respond(res, 200, { message: "Yeniləndi", data: seating });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const bulkCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const seatings = await Seating.bulkCreate(req.body, { validate: true });
    respond(res, 201, { message: "Oturacaqlar yaradıldı", data: seatings });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const seating = await Seating.findByPk(Number(req.params.id));
    if (!seating) { respond(res, 404, { message: "Tapılmadı" }); return; }
    await seating.destroy();
    respond(res, 200, { message: "Silindi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};
