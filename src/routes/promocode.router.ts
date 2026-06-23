import { Router as PromoRouter } from "express";
import { getAll as pGetAll, getById as pGetById, create as pCreate, update as pUpdate, remove as pRemove, validateCode } from "../controllers/promocode.controller";
import { requirePermission } from "../middlewares/role.middlewares";
import { protect } from "../middlewares/auth.middleware";
import { bulkCreate } from "../controllers/promocode.controller";


const promoRouter = PromoRouter();

promoRouter.get("/", protect, requirePermission("manage_promocodes"), pGetAll);
promoRouter.get("/:id", protect, requirePermission("manage_promocodes"), pGetById);
promoRouter.post("/validate", protect, validateCode);   
promoRouter.post("/bulk", protect, requirePermission("manage_promocodes"), bulkCreate);
promoRouter.post("/", protect, requirePermission("manage_promocodes"), pCreate);
promoRouter.put("/:id", protect, requirePermission("manage_promocodes"), pUpdate);
promoRouter.delete("/:id", protect, requirePermission("manage_promocodes"), pRemove);

export default promoRouter;
