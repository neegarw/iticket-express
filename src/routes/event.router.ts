import { Router } from 'express';
import { bulkCreateEvents, create, getAll, getById, remove, update } from '../controllers/event.controller';
import { eventSchema } from '../validators/event.validator';
import { validate } from '../middlewares/validate';
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const router = Router();

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Protected
router.post('/', protect, requirePermission("create_event"), validate(eventSchema), create);
router.post('/bulk', protect, requirePermission("create_event"), bulkCreateEvents);
router.put('/:id', protect, requirePermission("edit_event"), validate(eventSchema.partial()), update);
router.delete('/:id', protect, requirePermission("delete_event"), remove);

export default router;