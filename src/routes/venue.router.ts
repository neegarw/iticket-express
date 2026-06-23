import { Router } from 'express';
import { getAll, getById, create, update, remove, bulkCreateVenues } from '../controllers/venue.controller';
import { validate } from '../middlewares/validate';
import { venueSchema } from '../validators/venue.validator';
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const router = Router();

// Public
router.get('/', getAll);
router.get('/:id', getById);

// Protected
router.post('/', protect, requirePermission("create_venue"), validate(venueSchema), create);
router.post('/bulk', protect, requirePermission("create_venue"), bulkCreateVenues);
router.put('/:id', protect, requirePermission("edit_venue"), validate(venueSchema.partial()), update);
router.delete('/:id', protect, requirePermission("delete_venue"), remove);

export default router;