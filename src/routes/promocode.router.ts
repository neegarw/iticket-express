import { Router as PromoRouter } from "express";
import { getAll as pGetAll, getById as pGetById, create as pCreate, update as pUpdate, remove as pRemove, validateCode } from "../controllers/promocode.controller";
import { requirePermission } from "../middlewares/role.middlewares";
import { protect } from "../middlewares/auth.middleware";
import { bulkCreate } from "../controllers/promocode.controller";
import { validate } from "../middlewares/validate";
import { bulkPromoSchema, createPromoSchema, promoQuerySchema, updatePromoSchema, validatePromoSchema } from "../validations/commerce.validation";
import { idParamSchema } from "../validations/common.validation";


const promoRouter = PromoRouter();

promoRouter.get("/", protect, requirePermission("manage_promocodes"), validate(promoQuerySchema, "query"), pGetAll);
promoRouter.get("/:id", protect, requirePermission("manage_promocodes"), validate(idParamSchema, "params"), pGetById);
promoRouter.post("/validate", protect, validate(validatePromoSchema), validateCode);
promoRouter.post("/bulk", protect, requirePermission("manage_promocodes"), validate(bulkPromoSchema), bulkCreate);
promoRouter.post("/", protect, requirePermission("manage_promocodes"), validate(createPromoSchema), pCreate);
promoRouter.put("/:id", protect, requirePermission("manage_promocodes"), validate(idParamSchema, "params"), validate(updatePromoSchema), pUpdate);
promoRouter.delete("/:id", protect, requirePermission("manage_promocodes"), validate(idParamSchema, "params"), pRemove);

export default promoRouter;
