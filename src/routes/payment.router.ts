import { Router as PayRouter } from "express";
import { create as payCreate, getByOrderId, getAll as payGetAll } from "../controllers/payment.controller";
import { requirePermission } from "../middlewares/role.middlewares";
import { protect } from "../middlewares/auth.middleware";

const paymentRouter = PayRouter();

paymentRouter.post("/", protect, payCreate);
paymentRouter.get("/order/:order_id", protect, getByOrderId);
paymentRouter.get("/", protect, requirePermission("view_payments"), payGetAll);

export default paymentRouter;
