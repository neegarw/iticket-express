import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { getAll, getById, create, update, remove, bulkCreate } from "../controllers/eventseat.controller";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getById);

// Protected
router.post("/", protect, requirePermission("manage_tickets"), create);
router.post("/bulk", protect, requirePermission("manage_tickets"), bulkCreate);
router.put("/:id", protect, requirePermission("manage_tickets"), update);
router.delete("/:id", protect, requirePermission("manage_tickets"), remove);

export default router;