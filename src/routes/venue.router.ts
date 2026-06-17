import { Router } from 'express';
import { getAll, getById, create, update, remove, bulkCreateVenues } from '../controller/venue.controller';
import { validate } from '../middlewares/validate';
import { venueSchema } from '../validators/venue.validator';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validate(venueSchema), create);
router.put('/:id', validate(venueSchema.partial()), update);
router.delete('/:id', remove);

router.post('/bulk', bulkCreateVenues);

export default router;