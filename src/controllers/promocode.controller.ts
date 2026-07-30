import { Request, Response } from "express";
import { PromoCode } from "../models/promocode.model";
import { Event } from "../models/event.model";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { event_id } = req.query;
    const where: any = {};
    if (event_id) where.event_id = event_id;

    const promos = await PromoCode.findAll({ where, include: [{ model: Event }] });
    respond(res, 200, { data: promos });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await PromoCode.findByPk(Number(req.params.id), {
      include: [{ model: Event }],
    });
    if (!promo) { respond(res, 404, { message: "Tapılmadı" }); return; }
    respond(res, 200, { data: promo });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, percentage, max_discount, expiry_date, event_id } = req.body;

    if (!code || !percentage || !max_discount || !expiry_date) {
      respond(res, 400, { message: "code, percentage, max_discount, expiry_date mütləqdir" });
      return;
    }

    if (percentage <= 0 || percentage > 100) {
      respond(res, 400, { message: "percentage 1-100 arasında olmalıdır" });
      return;
    }

    if (max_discount <= 0) {
      respond(res, 400, { message: "max_discount müsbət ədəd olmalıdır" });
      return;
    }

    // event_id verilibsə, mövcudluğunu yoxla (verilməyibsə => bütün event-lərə tətbiq olunur)
    if (event_id) {
      const event = await Event.findByPk(event_id);
      if (!event) { respond(res, 400, { message: `Event ID ${event_id} mövcud deyil` }); return; }
    }

    const existing = await PromoCode.findOne({ where: { code } });
    if (existing) {
      respond(res, 400, { message: `"${code}" kodu artıq mövcuddur` });
      return;
    }

    const promo = await PromoCode.create({
      code,
      percentage,
      max_discount,
      expiry_date,
      event_id: event_id ?? null,
    });

    respond(res, 201, { message: "Promo kod yaradıldı", data: promo });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const bulkCreate = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = req.body as {
      code: string;
      percentage: number;
      max_discount: number;
      expiry_date: Date;
      event_id?: number;
    }[];

    if (!Array.isArray(items)) {
      respond(res, 400, { message: "Body array olmalıdır" });
      return;
    }

    for (const item of items) {
      if (!item.code || !item.percentage || !item.max_discount || !item.expiry_date) {
        respond(res, 400, { message: "code, percentage, max_discount, expiry_date mütləqdir" });
        return;
      }
      if (item.event_id) {
        const event = await Event.findByPk(item.event_id);
        if (!event) {
          respond(res, 400, { message: `Event ID ${item.event_id} mövcud deyil` });
          return;
        }
      }
      const existing = await PromoCode.findOne({ where: { code: item.code } });
      if (existing) {
        respond(res, 400, { message: `"${item.code}" kodu artıq mövcuddur` });
        return;
      }
    }

    const promos = await PromoCode.bulkCreate(items, { validate: true });
    respond(res, 201, { message: "Promo kodlar yaradıldı", data: promos });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await PromoCode.findByPk(Number(req.params.id));
    if (!promo) { respond(res, 404, { message: "Tapılmadı" }); return; }

    if (req.body.event_id) {
      const event = await Event.findByPk(req.body.event_id);
      if (!event) { respond(res, 400, { message: `Event ID ${req.body.event_id} mövcud deyil` }); return; }
    }

    if (req.body.percentage !== undefined && (req.body.percentage <= 0 || req.body.percentage > 100)) {
      respond(res, 400, { message: "percentage 1-100 arasında olmalıdır" });
      return;
    }

    await promo.update(req.body);
    respond(res, 200, { message: "Yeniləndi", data: promo });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const promo = await PromoCode.findByPk(Number(req.params.id));
    if (!promo) { respond(res, 404, { message: "Tapılmadı" }); return; }
    await promo.destroy();
    respond(res, 200, { message: "Silindi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const validateCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, event_id } = req.body;

    if (!code) {
      respond(res, 400, { message: "code mütləqdir" });
      return;
    }

    const promo = await PromoCode.findOne({ where: { code } });
    if (!promo) { respond(res, 404, { message: "Promo kod tapılmadı" }); return; }

    if (new Date() > promo.expiry_date) {
      respond(res, 400, { message: "Promo kodun müddəti bitib" });
      return;
    }

    // Event-ə bağlı promo kod — yalnız o event üçün keçərlidir
    if (promo.event_id !== null) {
      if (!event_id || Number(event_id) !== promo.event_id) {
        respond(res, 400, { message: "Bu promo kod bu tədbir üçün keçərli deyil" });
        return;
      }
    }

    respond(res, 200, {
      data: {
        valid: true,
        percentage: promo.percentage,
        max_discount: promo.max_discount,
        event_id: promo.event_id,
      },
    });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};