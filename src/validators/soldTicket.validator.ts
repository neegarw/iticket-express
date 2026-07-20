import { z } from "zod";

export const soldTicketSchema = z.object({
  seating_number: z.number().int().positive(),
  sold_price: z.number().nonnegative(),
  seating_id: z.number().int().positive(),
  order_id: z.number().int().positive(),
});