import { Router } from "express";
import {
    create,
    getAll,
    getById,
    update,
    remove,
} from "../controllers/soldticket.controller";
import { validate } from "../middlewares/validate";
import { soldTicketSchema } from "../validators/soldTicket.validator";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:id", getById);

router.post("/", protect, validate(soldTicketSchema), create);
router.put( "/:id", protect, validate(soldTicketSchema.partial()), update);
router.delete( "/:id",protect,remove);

export default router;