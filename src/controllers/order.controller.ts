import { Response, Request } from "express";
import { Order } from "../models/order.model";
import { Ticket } from "../models/ticket.model";
import { EventSeat } from "../models/eventseat.model";
import { PromoCode } from "../models/promocode.model";
import { Payment } from "../models/payment.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import sequelize from "../config/db";
import crypto from "crypto";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user!.id },
      include: [
        { model: Ticket, include: [{ model: EventSeat }] },
        { model: PromoCode },
        { model: Payment },
      ],
    });
    respond(res, 200, { data: orders });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      where: { id: Number(req.params.id), user_id: req.user!.id },
      include: [
        { model: Ticket, include: [{ model: EventSeat }] },
        { model: PromoCode },
        { model: Payment },
      ],
    });
    if (!order) { respond(res, 404, { message: "Sifariş tapılmadı" }); return; }
    respond(res, 200, { data: order });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

// Birbaşa sifariş + yer tutma — atomik, kim əvvəl commit edir onundur
export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { event_seat_ids, promocode } = req.body as {
      event_seat_ids: number[];
      promocode?: string;
    };

    if (!Array.isArray(event_seat_ids) || event_seat_ids.length === 0) {
      await t.rollback();
      respond(res, 400, { message: "event_seat_ids boş ola bilməz" });
      return;
    }

    // Sətir kilidi (SELECT ... FOR UPDATE) — eyni anda başqa sorğu bu sətirləri
    // oxuya bilməz, transaction bitənə qədər gözləyir
    const eventSeats = await EventSeat.findAll({
      where: { id: event_seat_ids },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (eventSeats.length !== event_seat_ids.length) {
      await t.rollback();
      respond(res, 400, { message: "Bəzi EventSeat ID-ləri mövcud deyil" });
      return;
    }

    // Kilid alındıqdan sonra status yoxlanılır — əgər başqası bir addım əvvəl
    // udubsa, bura "sold" kimi görünəcək
    const notAvailable = eventSeats.filter((es) => es.status !== "available");
    if (notAvailable.length > 0) {
      await t.rollback();
      respond(res, 400, {
        message: `Bu yerlər artıq satılıb: ${notAvailable.map((es) => es.id).join(", ")}`,
      });
      return;
    }

    const uniqueEventIds = [...new Set(eventSeats.map((es) => es.event_id))];
    const subtotal = eventSeats.reduce((sum, es) => sum + Number(es.price), 0);

    let discount = 0;
    let promocode_id: number | null = null;

    if (promocode) {
      const promo = await PromoCode.findOne({ where: { code: promocode }, transaction: t });

      if (!promo) {
        await t.rollback();
        respond(res, 400, { message: "Promo kod tapılmadı" });
        return;
      }

      if (new Date() > promo.expiry_date) {
        await t.rollback();
        respond(res, 400, { message: "Promo kodun vaxtı bitib" });
        return;
      }

      if (promo.event_id !== null) {
        const applicable = uniqueEventIds.length === 1 && uniqueEventIds[0] === promo.event_id;
        if (!applicable) {
          await t.rollback();
          respond(res, 400, {
            message: "Bu promo kod yalnız müəyyən bir tədbirin biletlərinə tətbiq olunur",
          });
          return;
        }
      }

      const rawDiscount = (subtotal * promo.percentage) / 100;
      discount = Math.min(rawDiscount, promo.max_discount);
      promocode_id = promo.id;
    }

    const total_price = Math.round(subtotal - discount);

    // Yerləri dərhal "sold" et — heç bir aralıq/rezerv mərhələsi yoxdur
    await EventSeat.update(
      { status: "sold" },
      { where: { id: event_seat_ids }, transaction: t }
    );

    const order = await Order.create(
      {
        date: new Date(),
        status: "pending", // ödəniş gözlənilir, amma yer artıq bu sifarişindir
        total_price,
        user_id: req.user!.id,
        promocode_id,
      },
      { transaction: t }
    );

    const ticketsData = eventSeats.map((es) => ({
      event_seat_id: es.id,
      order_id: order.id,
      qr_code: crypto.randomUUID(),
    }));

    await Ticket.bulkCreate(ticketsData, { transaction: t });

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: Ticket, include: [{ model: EventSeat }] }, { model: PromoCode }],
    });

    respond(res, 201, { message: "Sifariş yaradıldı, ödəniş gözlənilir", data: fullOrder });
  } catch (err) {
    await t.rollback();
    respond(res, 500, { message: (err as Error).message });
  }
};

// Sifarişi ləğv et — yer yenidən "available" olur
export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findOne({
      where: { id: Number(req.params.id), user_id: req.user!.id },
      transaction: t,
    });
    if (!order) { await t.rollback(); respond(res, 404, { message: "Tapılmadı" }); return; }
    if (order.status === "confirmed") {
      await t.rollback();
      respond(res, 400, { message: "Təsdiqlənmiş sifariş ləğv edilə bilməz" });
      return;
    }

    const tickets = await Ticket.findAll({ where: { order_id: order.id }, transaction: t });
    const eventSeatIds = tickets.map((tk) => tk.event_seat_id);

    await EventSeat.update(
      { status: "available" },
      { where: { id: eventSeatIds }, transaction: t }
    );

    await Ticket.destroy({ where: { order_id: order.id }, transaction: t });
    await order.update({ status: "cancelled" }, { transaction: t });

    await t.commit();
    respond(res, 200, { message: "Sifariş ləğv edildi" });
  } catch (err) {
    await t.rollback();
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getAllAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Ticket, include: [{ model: EventSeat }] }, { model: Payment }],
    });
    respond(res, 200, { data: orders });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(Number(req.params.id));
    if (!order) { respond(res, 404, { message: "Tapılmadı" }); return; }
    await order.update({ status });
    respond(res, 200, { message: "Status yeniləndi", data: order });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};