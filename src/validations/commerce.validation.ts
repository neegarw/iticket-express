import { z } from "zod";
import { nonEmptyUpdate, optionalIdQuery } from "./common.validation";

const promoFields = {
  code: z.string().trim().min(2).max(50).transform((value) => value.toUpperCase()),
  percentage: z.coerce.number().positive().max(100),
  max_discount: z.coerce.number().positive().max(1000000),
  expiry_date: z.coerce.date(),
  event_id: z.coerce.number().int().positive().nullable().optional(),
};
export const createPromoSchema = z.object(promoFields);
export const updatePromoSchema = nonEmptyUpdate(promoFields);
export const bulkPromoSchema = z.array(createPromoSchema).min(1).max(100);
export const validatePromoSchema = z.object({
  code: z.string().trim().min(2).max(50).transform((value) => value.toUpperCase()),
  event_id: z.coerce.number().int().positive().optional(),
});
export const promoQuerySchema = z.object({ event_id: optionalIdQuery });

export const createOrderSchema = z.object({
  event_seat_ids: z
    .array(z.coerce.number().int().positive())
    .min(1)
    .max(20)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "event_seat_ids təkrarlana bilməz",
    }),
  promocode: z.string().trim().min(2).max(50).optional(),
});
export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export const createPaymentSchema = z.object({
  order_id: z.coerce.number().int().positive(),
  method: z.enum(["card", "cash", "online"]),
});

export const verifyQrSchema = z.object({ qr_code: z.string().uuid("qr_code düzgün UUID olmalıdır") });
export const ticketQuerySchema = z.object({
  order_id: optionalIdQuery,
  event_seat_id: optionalIdQuery,
});
