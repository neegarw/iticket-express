import { Router } from "express";
import { getMyTickets, getById, getAll, verifyByQr, showTicket } from "../controllers/ticket.controller";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/role.middlewares";
import { validate } from "../middlewares/validate";
import { ticketQuerySchema, verifyQrSchema } from "../validations/commerce.validation";
import { idParamSchema } from "../validations/common.validation";

const ticketRouter = Router();

// User
ticketRouter.get("/my", protect, getMyTickets);
ticketRouter.get("/:id", protect, validate(idParamSchema, "params"), getById);
ticketRouter.get("/:id/view", validate(idParamSchema, "params"), showTicket);

// Admin
ticketRouter.get("/", protect, requirePermission("manage_tickets"), validate(ticketQuerySchema, "query"), getAll);
ticketRouter.post("/verify", protect, requirePermission("manage_tickets"), validate(verifyQrSchema), verifyByQr);

export default ticketRouter;
