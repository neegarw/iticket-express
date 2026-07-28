import { Router } from "express";
import { bulkCreateCategories, create, getAll, getById, remove, update } from "../controllers/category.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getById);

// Protected
router.post("/", protect, requirePermission("create_category"), create);
router.post("/bulk", protect, requirePermission("create_category"), bulkCreateCategories);
router.put("/:id", protect, requirePermission("edit_category"), update);
router.delete("/:id", protect, requirePermission("delete_category"), remove);

export default router;