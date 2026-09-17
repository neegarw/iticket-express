import { Router } from 'express';
import { bulkCreateEvents, create, getAll, getById, remove, update } from '../controllers/event.controller';
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { validate } from "../middlewares/validate";
import {
  bulkCreateEventsSchema,
  createEventSchema,
  eventQuerySchema,
  updateEventSchema,
} from "../validations/event.validation";
import { idParamSchema } from "../validations/common.validation";

const router = Router();

// Public
router.get('/', validate(eventQuerySchema, "query"), getAll);
router.get('/:id', validate(idParamSchema, "params"), getById);

// Protected
router.post('/', protect, requirePermission("create_event"), validate(createEventSchema), create);
router.post('/bulk', protect, requirePermission("create_event"), validate(bulkCreateEventsSchema), bulkCreateEvents);
router.put('/:id', protect, requirePermission("edit_event"), validate(idParamSchema, "params"), validate(updateEventSchema), update);
router.delete('/:id', protect, requirePermission("delete_event"), validate(idParamSchema, "params"), remove);

export default router;
