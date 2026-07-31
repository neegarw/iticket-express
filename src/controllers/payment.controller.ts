import { Request, Response } from "express";
import { Payment } from "../models/payment.model";
import { Order } from "../models/order.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import sequelize from "../config/db";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  const t = await sequelize.transaction();

  try {
    const { order_id, method } = req.body;

    if (!order_id || !method) {
      await t.rollback();
      respond(res, 400, { message: "order_id və method mütləqdir" });
      return;
    }

    const order = await Order.findOne({
      where: { id: order_id, user_id: req.user!.id },
      transaction: t,
    });

    if (!order) {
      await t.rollback();
      respond(res, 404, { message: "Sifariş tapılmadı" });
      return;
    }

    if (order.status === "cancelled") {
      await t.rollback();
      respond(res, 400, {
        message: "Ləğv edilmiş sifariş üçün ödəniş edilə bilməz",
      });
      return;
    }

    if (order.status === "confirmed") {
      await t.rollback();
      respond(res, 400, {
        message: "Bu sifariş artıq təsdiqlənib",
      });
      return;
    }

    const existing = await Payment.findOne({
      where: { order_id },
      transaction: t,
    });

    if (existing) {
      await t.rollback();
      respond(res, 400, {
        message: "Bu sifariş üçün ödəniş artıq mövcuddur",
      });
      return;
    }

    const payment = await Payment.create(
      {
        method,
        status: "success",
        transaction_id: `TXN-${Date.now()}`,
        order_id,
        paid_at: new Date(),
      },
      { transaction: t }
    );

    await order.update(
      { status: "confirmed" },
      { transaction: t }
    );

    await t.commit();

    respond(res, 201, {
      message: "Ödəniş uğurlu",
      data: payment,
    });
  } catch (err) {
    await t.rollback();
    respond(res, 500, {
      message: (err as Error).message,
    });
  }
};

export const getByOrderId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      where: { id: Number(req.params.order_id), user_id: req.user!.id },
    });
    if (!order) { respond(res, 404, { message: "Sifariş tapılmadı" }); return; }

    const payment = await Payment.findOne({
      where: { order_id: Number(req.params.order_id) },
      include: [{ model: Order }],
    });
    if (!payment) { respond(res, 404, { message: "Ödəniş tapılmadı" }); return; }
    respond(res, 200, { data: payment });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const payments = await Payment.findAll({ include: [{ model: Order }] });
    respond(res, 200, { data: payments });
  } catch (err) {
    respond(res, 500, { message: (err as Error).message });
  }
};

