import { z } from "zod";

const positiveId = z
  .string()
  .regex(/^[1-9]\d*$/, "ID müsbət tam ədəd olmalıdır");

export const idParamSchema = z.object({ id: positiveId });
export const userIdParamSchema = z.object({ userId: positiveId });
export const adminIdParamSchema = z.object({ adminId: positiveId });
export const orderIdParamSchema = z.object({ order_id: positiveId });
export const ticketIdParamSchema = z.object({ ticketId: positiveId });

export const optionalIdQuery = z
  .string()
  .regex(/^[1-9]\d*$/, "ID müsbət tam ədəd olmalıdır")
  .optional();

export const nonEmptyUpdate = <T extends z.ZodRawShape>(shape: T) =>
  z.object(shape).partial().refine((body) => Object.keys(body).length > 0, {
    message: "Yeniləmək üçün ən azı bir sahə göndərilməlidir",
  });
