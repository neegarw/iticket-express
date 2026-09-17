import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import {
  createTicket,
  getMyTickets,
  getMessages,
  getAllTickets,
  replyToTicket,
  closeTicket,
  requestClose,
} from "../controllers/support.controller";
import { validate } from "../middlewares/validate";
import { closeSupportTicketSchema, createSupportTicketSchema, supportMessageSchema } from "../validations/admin-support.validation";
import { ticketIdParamSchema } from "../validations/common.validation";

const router = Router();

// İstifadəçi tərəfi
router.post("/tickets", protect, validate(createSupportTicketSchema), createTicket);
router.get("/tickets", protect, getMyTickets);
router.get("/tickets/:ticketId/messages", protect, validate(ticketIdParamSchema, "params"), getMessages);

// Admin/agent tərəfi — yalnız manage_support icazəsi olanlar
router.get("/admin/tickets", protect, requirePermission("manage_support"), getAllTickets);
router.post(
  "/admin/tickets/:ticketId/messages",
  protect,
  requirePermission("manage_support"),
  validate(ticketIdParamSchema, "params"),
  validate(supportMessageSchema),
  replyToTicket
);

router.post(
  "/admin/tickets/:ticketId/request-close",
  protect,
  requirePermission("manage_support"),
  validate(ticketIdParamSchema, "params"),
  requestClose
);
router.post("/tickets/:ticketId/close", protect, validate(ticketIdParamSchema, "params"), validate(closeSupportTicketSchema), closeTicket);

export default router;
