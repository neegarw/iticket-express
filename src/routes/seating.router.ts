import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { getAll, getById, create, update, remove } from "../controllers/seating.controller";
import { bulkCreate } from "../controllers/seating.controller";


const seatRouter = Router();

seatRouter.get("/", getAll);
seatRouter.get("/:id", getById);
seatRouter.post("/", protect, requirePermission("manage_seats"), create);
seatRouter.post("/bulk", protect, requirePermission("manage_seats"), bulkCreate);
seatRouter.put("/:id", protect, requirePermission("manage_seats"), update);
seatRouter.delete("/:id", protect, requirePermission("manage_seats"), remove);

export default seatRouter;