import { Router } from "express";
import { validate } from '../middlewares/validate';
import { categorySchema } from '../validators/category.validator';
import { bulkCreateCategories, create, getAll, getById, remove, update } from "../controller/category.controller";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post('/', validate(categorySchema), create);
router.post("/bulk", bulkCreateCategories);
router.put('/:id', validate(categorySchema.partial()), update);
router.delete("/:id", remove);

export default router;