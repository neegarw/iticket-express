import { Router as PayRouter } from "express";
import { create as payCreate, getByOrderId, getAll as payGetAll } from "../controllers/payment.controller";
import { requirePermission } from "../middlewares/role.middlewares";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createPaymentSchema } from "../validations/commerce.validation";
import { orderIdParamSchema } from "../validations/common.validation";

const paymentRouter = PayRouter();

paymentRouter.post("/", protect, validate(createPaymentSchema), payCreate);
paymentRouter.get("/order/:order_id", protect, validate(orderIdParamSchema, "params"), getByOrderId);
paymentRouter.get("/", protect, requirePermission("view_payments"), payGetAll);

export default paymentRouter;
