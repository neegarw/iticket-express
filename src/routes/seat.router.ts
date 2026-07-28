import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { getAll, getById, create, update, remove, bulkCreate } from "../controllers/seat.contoller";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getById);

// Protected
router.post("/", protect, requirePermission("manage_seats"), create);
router.post("/bulk", protect, requirePermission("manage_seats"), bulkCreate);
router.put("/:id", protect, requirePermission("manage_seats"), update);
router.delete("/:id", protect, requirePermission("manage_seats"), remove);

export default router;