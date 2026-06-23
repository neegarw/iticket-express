import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Seating } from "../models/seating.model";
import { PromoCode } from "../models/promocode.model";
import { SoldTicket } from "../models/soldticket.model";
import { Payment } from "../models/payment.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import sequelize from "../config/db";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user!.id },
      include: [
        { model: Seating },
        { model: PromoCode },
        { model: SoldTicket },
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
      include: [{ model: Seating }, { model: PromoCode }, { model: SoldTicket }, { model: Payment }],
    });
    if (!order) { respond(res, 404, { message: "Sifariş tapılmadı" }); return; }
    respond(res, 200, { data: order });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

// Sifariş yarat — promo kod varsa endirim tətbiq et
export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();
  try {
    const { seating_id, ticket_count, promocode } = req.body;

    const seating = await Seating.findByPk(seating_id);
    if (!seating) { await t.rollback(); respond(res, 400, { message: "Seating tapılmadı" }); return; }

    if (seating.count < ticket_count) {
      await t.rollback();
      respond(res, 400, { message: `Yalnız ${seating.count} bilet mövcuddur` });
      return;
    }

    // Promo kod yoxla
    let discount = 0;
    let promocode_id: number | undefined;

    if (promocode) {
      const promo = await PromoCode.findOne({ where: { code: promocode } });
      if (promo && new Date() <= promo.expiry_date) {
        discount = promo.percentage;
        promocode_id = promo.id;
      }
    }

    // Qiymət hesabla (ticket qiyməti seating-dən gəlir — sadələşdirilmiş)
    const base_price = 10; // real layihədə Ticket modelindən gəlməlidir
    const total = Math.round(base_price * ticket_count * (1 - discount / 100));

    const order = await Order.create(
      { date: new Date(), status: "pending", total_price: total, seating_id, user_id: req.user!.id, promocode_id },
      { transaction: t }
    );

    // Sold tickets yarat
    const soldTickets = [];
    for (let i = 1; i <= ticket_count; i++) {
      soldTickets.push({ seating_number: i, sold_price: Math.round(total / ticket_count), seating_id, order_id: order.id });
    }
    await SoldTicket.bulkCreate(soldTickets, { transaction: t });

    // Seating count azalt
    await seating.update({ count: seating.count - ticket_count }, { transaction: t });

    await t.commit();
    respond(res, 201, { message: "Sifariş yaradıldı", data: order });
  } catch (err) {
    await t.rollback();
    respond(res, 500, { message: (err as Error).message });
  }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      where: { id: Number(req.params.id), user_id: req.user!.id },
    });
    if (!order) { respond(res, 404, { message: "Tapılmadı" }); return; }
    if (order.status === "confirmed") {
      respond(res, 400, { message: "Təsdiqlənmiş sifariş ləğv edilə bilməz" }); return;
    }
    await order.update({ status: "cancelled" });
    respond(res, 200, { message: "Sifariş ləğv edildi" });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

// Admin: bütün sifarişlər
export const getAllAdmin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Seating }, { model: SoldTicket }, { model: Payment }],
    });
    respond(res, 200, { data: orders });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

// Admin: status dəyiş
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
