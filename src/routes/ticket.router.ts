import { Router as TicketRouter } from "express";
import { getAll as tGetAll, getById as tGetById, create as tCreate, update as tUpdate, remove as tRemove } from "../controllers/ticket.controller";
import { requirePermission } from "../middlewares/role.middlewares";
import { protect } from "../middlewares/auth.middleware";
import { bulkCreate } from "../controllers/ticket.controller";


const ticketRouter = TicketRouter();

ticketRouter.get("/", tGetAll);
ticketRouter.get("/:id", tGetById);
ticketRouter.post("/", protect, requirePermission("manage_tickets"), tCreate);
ticketRouter.post("/bulk", protect, requirePermission("manage_tickets"), bulkCreate);
ticketRouter.put("/:id", protect, requirePermission("manage_tickets"), tUpdate);
ticketRouter.delete("/:id", protect, requirePermission("manage_tickets"), tRemove);

export default ticketRouter;