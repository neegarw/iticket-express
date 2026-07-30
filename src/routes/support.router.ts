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

const router = Router();

// İstifadəçi tərəfi
router.post("/tickets", protect, createTicket);
router.get("/tickets", protect, getMyTickets);
router.get("/tickets/:ticketId/messages", protect, getMessages);

// Admin/agent tərəfi — yalnız manage_support icazəsi olanlar
router.get("/admin/tickets", protect, requirePermission("manage_support"), getAllTickets);
router.post(
  "/admin/tickets/:ticketId/messages",
  protect,
  requirePermission("manage_support"),
  replyToTicket
);

router.post(
  "/admin/tickets/:ticketId/request-close",
  protect,
  requirePermission("manage_support"),
  requestClose
);
router.post("/tickets/:ticketId/close", protect, closeTicket);

export default router;