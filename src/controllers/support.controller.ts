import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as SupportService from "../services/support.service";
import { notifyTicketStatus } from "../socket/socket";


const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subject } = req.body;
    if (!subject) { respond(res, 400, { message: "Mövzu tələb olunur" }); return; }

    const ticket = await SupportService.createTicket(req.user!.id, subject);
    respond(res, 201, { ticket });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const getMyTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await SupportService.getUserTickets(req.user!.id);
    respond(res, 200, { tickets });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await SupportService.getTicketMessages(Number(req.params.ticketId));
    respond(res, 200, { messages });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const getAllTickets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await SupportService.getAllTickets();
    respond(res, 200, { tickets });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const replyToTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text) { respond(res, 400, { message: "Mesaj boş ola bilməz" }); return; }

    const senderName = `${req.user!.name} ${req.user!.surname || ""}`.trim();

    const message = await SupportService.addMessage(
      Number(req.params.ticketId),
      req.user!.id,
      "agent",
      senderName,
      text
    );
    respond(res, 201, { message });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const requestClose = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const operatorName = `${req.user!.name} ${req.user!.surname || ""}`.trim();
    const ticketId = Number(req.params.ticketId);

    const ticket = await SupportService.requestClose(ticketId, req.user!.id, operatorName);

    // Client-ə canlı bildiriş göndər
    notifyTicketStatus(ticketId, "resolved");

    respond(res, 200, { message: "Sorğu bağlanma üçün göndərildi", ticket });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const closeTicket = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      respond(res, 400, { message: "Qiymətləndirmə 1-5 arası olmalıdır" });
      return;
    }
    const ticket = await SupportService.closeByClient(Number(req.params.ticketId), rating, comment);
    respond(res, 200, { message: "Sorğu bağlandı, təşəkkürlər!", ticket });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

