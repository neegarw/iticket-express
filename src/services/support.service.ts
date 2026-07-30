import SupportTicket from "../models/supportTicket.model";
import SupportMessage from "../models/supportMessage.model";

export const createTicket = async (userId: number, subject: string) => {
  return SupportTicket.create({ userId, subject, status: "open" });
};

export const getUserTickets = async (userId: number) => {
  return SupportTicket.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
};

export const getTicketMessages = async (ticketId: number) => {
  return SupportMessage.findAll({ where: { ticketId }, order: [["createdAt", "ASC"]] });
};
export const getAllTickets = async () => {
  return SupportTicket.findAll({ order: [["createdAt", "DESC"]] });
};

export const addMessage = async (
  ticketId: number,
  senderId: number,
  senderType: "user" | "agent",
  senderName: string,
  text: string
) => {
  return SupportMessage.create({ ticketId, senderId, senderType, senderName, message: text });
};

const STANDARD_CLOSE_MESSAGE =
  "Sorğunuz üzrə köməklik başa çatdı. Əgər probleminiz həll olunubsa, sorğunu bağlaya və bizi qiymətləndirə bilərsiniz.";

export const requestClose = async (ticketId: number, operatorId: number, operatorName: string) => {
  await addMessage(ticketId, operatorId, "agent", operatorName, STANDARD_CLOSE_MESSAGE);
  const ticket = await SupportTicket.findByPk(ticketId);
  if (ticket) {
    ticket.status = "resolved";
    await ticket.save();
  }
  return ticket;
};

export const closeByClient = async (ticketId: number, rating: number, comment?: string) => {
  const ticket = await SupportTicket.findByPk(ticketId);
  if (!ticket) return null;
  ticket.status = "closed";
  ticket.rating = rating;
  ticket.ratingComment = comment || null;
  await ticket.save();
  return ticket;
};