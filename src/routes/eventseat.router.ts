import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { getAll, getById, create, update, remove, bulkCreate } from "../controllers/eventseat.controller";
import { validate } from "../middlewares/validate";
import { bulkEventSeatSchema, createEventSeatSchema, eventSeatQuerySchema, updateEventSeatSchema } from "../validations/catalog.validation";
import { idParamSchema } from "../validations/common.validation";

const router = Router();

// Public
router.get("/", validate(eventSeatQuerySchema, "query"), getAll);
router.get("/:id", validate(idParamSchema, "params"), getById);

// Protected
router.post("/", protect, requirePermission("manage_tickets"), validate(createEventSeatSchema), create);
router.post("/bulk", protect, requirePermission("manage_tickets"), validate(bulkEventSeatSchema), bulkCreate);
router.put("/:id", protect, requirePermission("manage_tickets"), validate(idParamSchema, "params"), validate(updateEventSeatSchema), update);
router.delete("/:id", protect, requirePermission("manage_tickets"), validate(idParamSchema, "params"), remove);

export default router;
