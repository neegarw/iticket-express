import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { getAll, getById, create, update, remove } from "../controllers/seating.controller";
import { bulkCreate } from "../controllers/seating.controller";


const seatingRouter = Router();

seatingRouter.get("/", getAll);
seatingRouter.get("/:id", getById);
seatingRouter.post("/", protect, requirePermission("manage_seats"), create);
seatingRouter.post("/bulk", protect, requirePermission("manage_seats"), bulkCreate);
seatingRouter.put("/:id", protect, requirePermission("manage_seats"), update);
seatingRouter.delete("/:id", protect, requirePermission("manage_seats"), remove);

export default seatingRouter;