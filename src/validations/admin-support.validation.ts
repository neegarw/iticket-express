import { z } from "zod";

export const permissionBodySchema = z.object({
  adminId: z.coerce.number().int().positive(),
  permissionKey: z.string().trim().min(2).max(100),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().trim().min(3).max(200),
});
export const supportMessageSchema = z.object({
  text: z.string().trim().min(1).max(2000),
});
export const closeSupportTicketSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});
