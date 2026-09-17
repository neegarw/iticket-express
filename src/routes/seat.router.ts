import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { getAll, getById, create, update, remove, bulkCreate } from "../controllers/seat.contoller";
import { validate } from "../middlewares/validate";
import { bulkSeatSchema, createSeatSchema, seatQuerySchema, updateSeatSchema } from "../validations/catalog.validation";
import { idParamSchema } from "../validations/common.validation";

const router = Router();

// Public
router.get("/", validate(seatQuerySchema, "query"), getAll);
router.get("/:id", validate(idParamSchema, "params"), getById);

// Protected
router.post("/", protect, requirePermission("manage_seats"), validate(createSeatSchema), create);
router.post("/bulk", protect, requirePermission("manage_seats"), validate(bulkSeatSchema), bulkCreate);
router.put("/:id", protect, requirePermission("manage_seats"), validate(idParamSchema, "params"), validate(updateSeatSchema), update);
router.delete("/:id", protect, requirePermission("manage_seats"), validate(idParamSchema, "params"), remove);

export default router;
