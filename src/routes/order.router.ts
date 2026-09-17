import { Router as OrderRouter } from "express";
import { getAll as oGetAll, getById as oGetById, create as oCreate, cancelOrder, getAllAdmin, updateStatus } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { validate } from "../middlewares/validate";
import { createOrderSchema, updateOrderStatusSchema } from "../validations/commerce.validation";
import { idParamSchema } from "../validations/common.validation";

const orderRouter = OrderRouter();
/* Admin Routes */
orderRouter.get("/admin/all", protect, requirePermission("manage_orders"), getAllAdmin);
orderRouter.patch("/admin/:id/status", protect, requirePermission("manage_orders"), validate(idParamSchema, "params"), validate(updateOrderStatusSchema), updateStatus);

/* User Routes */

orderRouter.get("/", protect, oGetAll);
orderRouter.get("/:id", protect, validate(idParamSchema, "params"), oGetById);
orderRouter.post("/", protect, validate(createOrderSchema), oCreate);
orderRouter.patch("/:id/cancel", protect, validate(idParamSchema, "params"), cancelOrder);

export default orderRouter;
