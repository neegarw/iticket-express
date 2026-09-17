import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { getAll, getById, create, update, remove } from "../controllers/seating.controller";
import { bulkCreate } from "../controllers/seating.controller";
import { validate } from "../middlewares/validate";
import { bulkSeatingSchema, createSeatingSchema, seatingQuerySchema, updateSeatingSchema } from "../validations/catalog.validation";
import { idParamSchema } from "../validations/common.validation";


const seatingRouter = Router();

seatingRouter.get("/", validate(seatingQuerySchema, "query"), getAll);
seatingRouter.get("/:id", validate(idParamSchema, "params"), getById);
seatingRouter.post("/", protect, requirePermission("manage_seats"), validate(createSeatingSchema), create);
seatingRouter.post("/bulk", protect, requirePermission("manage_seats"), validate(bulkSeatingSchema), bulkCreate);
seatingRouter.put("/:id", protect, requirePermission("manage_seats"), validate(idParamSchema, "params"), validate(updateSeatingSchema), update);
seatingRouter.delete("/:id", protect, requirePermission("manage_seats"), validate(idParamSchema, "params"), remove);

export default seatingRouter;
