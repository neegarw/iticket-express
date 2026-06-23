import { Router as OrderRouter } from "express";
import { getAll as oGetAll, getById as oGetById, create as oCreate, cancelOrder, getAllAdmin, updateStatus } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const orderRouter = OrderRouter();

// User
orderRouter.get("/", protect, oGetAll);
orderRouter.get("/:id", protect, oGetById);
orderRouter.post("/", protect, oCreate);
orderRouter.patch("/:id/cancel", protect, cancelOrder);

// Admin
orderRouter.get("/admin/all", protect, requirePermission("manage_orders"), getAllAdmin);
orderRouter.patch("/admin/:id/status", protect, requirePermission("manage_orders"), updateStatus);

export default orderRouter;
