import { Request, Response } from "express";
import { Seat } from "../models/seat.model";
import { Seating } from "../models/seating.model";
import { EventSeat } from "../models/eventseat.model";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seating_id } = req.query;
    const where: any = {};
    if (seating_id) where.seating_id = seating_id;

    const seats = await Seat.findAll({ where, include: [{ model: Seating }] });
    respond(res, 200, { data: seats });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const seat = await Seat.findByPk(Number(req.params.id), {
      include: [{ model: Seating }],
    });
    if (!seat) { respond(res, 404, { message: "Tapılmadı" }); return; }
    respond(res, 200, { data: seat });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { row, seat_number, seating_id } = req.body;

    if (!row || !seat_number) {
      respond(res, 400, { message: "row və seat_number mütləqdir" });
      return;
    }

    const seating = await Seating.findByPk(seating_id);
    if (!seating) { respond(res, 400, { message: `Seating ID ${seating_id} mövcud deyil` }); return; }

    const existing = await Seat.findOne({ where: { seating_id, row, seat_number } });
    if (existing) {
      respond(res, 400, { message: `Bu zonada ${row}${seat_number} yeri artıq mövcuddur` });
      return;
    }

    const seat = await Seat.create({ row, seat_number, seating_id });
    respond(res, 201, { message: "Yer yaradıldı", data: seat });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const bulkCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = req.body as { row: string; seat_number: number; seating_id: number }[];

    if (!Array.isArray(items)) {
      respond(res, 400, { message: "Body array olmalıdır" });
      return;
    }

    for (const item of items) {
      if (!item.row || !item.seat_number) {
        respond(res, 400, { message: "row və seat_number mütləqdir" });
        return;
      }

      const seating = await Seating.findByPk(item.seating_id);
      if (!seating) {
        respond(res, 400, { message: `Seating ID ${item.seating_id} mövcud deyil` });
        return;
      }

      const existing = await Seat.findOne({
        where: { seating_id: item.seating_id, row: item.row, seat_number: item.seat_number },
      });
      if (existing) {
        respond(res, 400, {
          message: `Bu zonada ${item.row}${item.seat_number} yeri artıq mövcuddur`,
        });
        return;
      }
    }

    const seats = await Seat.bulkCreate(items, { validate: true });
    respond(res, 201, { message: "Yerlər yaradıldı", data: seats });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const seat = await Seat.findByPk(Number(req.params.id));
    if (!seat) { respond(res, 404, { message: "Tapılmadı" }); return; }

    const seating_id = req.body.seating_id ?? seat.seating_id;
    const row = req.body.row ?? seat.row;
    const seat_number = req.body.seat_number ?? seat.seat_number;

    if (req.body.seating_id) {
      const seating = await Seating.findByPk(seating_id);
      if (!seating) {
        respond(res, 400, { message: `Seating ID ${seating_id} mövcud deyil` });
        return;
      }
    }

    const existing = await Seat.findOne({ where: { seating_id, row, seat_number } });
    if (existing && existing.id !== seat.id) {
      respond(res, 400, { message: `Bu zonada ${row}${seat_number} yeri artıq mövcuddur` });
      return;
    }

    await seat.update({ seating_id, row, seat_number });
    respond(res, 200, { message: "Yeniləndi", data: seat });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const seat = await Seat.findByPk(Number(req.params.id));
    if (!seat) { respond(res, 404, { message: "Tapılmadı" }); return; }

    const eventSeatCount = await EventSeat.count({ where: { seat_id: seat.id } });
    if (eventSeatCount > 0) {
      respond(res, 400, { message: `Bu yer ${eventSeatCount} event-də istifadə olunub, silinə bilməz` });
      return;
    }

    await seat.destroy();
    respond(res, 200, { message: "Silindi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};