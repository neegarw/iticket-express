import { Router } from "express";
import { bulkCreateCategories, create, getAll, getById, remove, update } from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { validate } from "../middlewares/validate";
import { bulkCategorySchema, categoryQuerySchema, createCategorySchema, updateCategorySchema } from "../validations/catalog.validation";
import { idParamSchema } from "../validations/common.validation";

const router = Router();

// Public
router.get("/", validate(categoryQuerySchema, "query"), getAll);
router.get("/:id", validate(idParamSchema, "params"), getById);

// Protected
router.post("/", protect, requirePermission("create_category"), validate(createCategorySchema), create);
router.post("/bulk", protect, requirePermission("create_category"), validate(bulkCategorySchema), bulkCreateCategories);
router.put("/:id", protect, requirePermission("edit_category"), validate(idParamSchema, "params"), validate(updateCategorySchema), update);
router.delete("/:id", protect, requirePermission("delete_category"), validate(idParamSchema, "params"), remove);

export default router;
