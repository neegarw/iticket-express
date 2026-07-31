import { Router as OrderRouter } from "express";
import { getAll as oGetAll, getById as oGetById, create as oCreate, confirmOrder, cancelOrder, getAllAdmin, updateStatus } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const orderRouter = OrderRouter();
/* Admin Routes */
orderRouter.get("/admin/all", protect, requirePermission("manage_orders"), getAllAdmin);
orderRouter.patch("/admin/:id/status", protect, requirePermission("manage_orders"), updateStatus);

/* User Routes */

orderRouter.get("/", protect, oGetAll);
orderRouter.get("/:id", protect, oGetById);
orderRouter.post("/", protect, oCreate);
orderRouter.patch("/:id/confirm", protect, confirmOrder);
orderRouter.patch("/:id/cancel", protect, cancelOrder);

export default orderRouter;