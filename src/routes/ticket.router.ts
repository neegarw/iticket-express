import { Router } from "express";
import { getMyTickets, getById, getAll, verifyByQr, showTicket } from "../controllers/ticket.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";

const ticketRouter = Router();

// User
ticketRouter.get("/my", protect, getMyTickets);
ticketRouter.get("/:id", protect, getById);
ticketRouter.get("/:id/view", showTicket);

// Admin
ticketRouter.get("/", protect, requirePermission("manage_tickets"), getAll);
ticketRouter.post("/verify", protect, requirePermission("manage_tickets"), verifyByQr);

export default ticketRouter;