import { Router } from 'express';
import { bulkCreateEvents, create, getAll, getById, remove, update } from '../controllers/event.controller';
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const router = Router();

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Protected
router.post('/', protect, requirePermission("create_event"), create);
router.post('/bulk', protect, requirePermission("create_event"), bulkCreateEvents);
router.put('/:id', protect, requirePermission("edit_event"), update);
router.delete('/:id', protect, requirePermission("delete_event"), remove);

export default router;