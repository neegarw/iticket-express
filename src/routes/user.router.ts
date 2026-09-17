import { Router } from 'express';
import { getAll, getById, create, update, remove, bulkCreateVenues } from '../controllers/venue.controller';
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { validate } from "../middlewares/validate";
import { bulkVenueSchema, createVenueSchema, updateVenueSchema, venueQuerySchema } from "../validations/catalog.validation";
import { idParamSchema } from "../validations/common.validation";

const router = Router();

// Public
router.get('/', validate(venueQuerySchema, "query"), getAll);
router.get('/:id', validate(idParamSchema, "params"), getById);

// Protected
router.post('/', protect, requirePermission("create_venue"), validate(createVenueSchema), create);
router.post('/bulk', protect, requirePermission("create_venue"), validate(bulkVenueSchema), bulkCreateVenues);
router.put('/:id', protect, requirePermission("edit_venue"), validate(idParamSchema, "params"), validate(updateVenueSchema), update);
router.delete('/:id', protect, requirePermission("delete_venue"), validate(idParamSchema, "params"), remove);

export default router;
