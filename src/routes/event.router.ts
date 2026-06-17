import { Router } from 'express';
import { bulkCreateEvents, create, getAll, getById, remove, update } from '../controller/event.controller';
import { eventSchema } from '../validators/event.validator';
import { validate } from '../middlewares/validate';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', validate(eventSchema), create);
router.post('/bulk', bulkCreateEvents);
router.put('/:id', validate(eventSchema.partial()), update);
router.delete('/:id', remove);

export default router;