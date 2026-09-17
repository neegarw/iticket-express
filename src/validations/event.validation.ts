import { z } from "zod";

const eventFields = z.object({
  name: z
    .string({ error: "name mətn olmalıdır" })
    .trim()
    .min(2, "name ən azı 2 simvol olmalıdır")
    .max(150, "name ən çoxu 150 simvol ola bilər"),
  description: z
    .string({ error: "description mətn olmalıdır" })
    .trim()
    .max(2000, "description ən çoxu 2000 simvol ola bilər")
    .nullable()
    .optional(),
  date: z.coerce.date({ error: "date düzgün tarix olmalıdır" }),
  sale_date_end: z.coerce.date({
    error: "sale_date_end düzgün tarix olmalıdır",
  }),
  category_id: z.coerce
    .number({ error: "category_id ədəd olmalıdır" })
    .int("category_id tam ədəd olmalıdır")
    .positive("category_id müsbət olmalıdır"),
  venue_id: z.coerce
    .number({ error: "venue_id ədəd olmalıdır" })
    .int("venue_id tam ədəd olmalıdır")
    .positive("venue_id müsbət olmalıdır"),
  minimum_age: z.coerce
    .number({ error: "minimum_age ədəd olmalıdır" })
    .int("minimum_age tam ədəd olmalıdır")
    .min(0, "minimum_age mənfi ola bilməz")
    .max(100, "minimum_age 100-dən böyük ola bilməz")
    .optional(),
  image_url: z
    .string({ error: "image_url mətn olmalıdır" })
    .trim()
    .max(2048, "image_url çox uzundur")
    .nullable()
    .optional(),
});

export const createEventSchema = eventFields.refine(
  (event) => event.sale_date_end <= event.date,
  {
    path: ["sale_date_end"],
    message: "sale_date_end event tarixindən sonra ola bilməz",
  }
);

export const updateEventSchema = eventFields
  .partial()
  .refine((body) => Object.keys(body).length > 0, {
    message: "Yeniləmək üçün ən azı bir sahə göndərilməlidir",
  })
  .refine(
    (body) =>
      !body.date || !body.sale_date_end || body.sale_date_end <= body.date,
    {
      path: ["sale_date_end"],
      message: "sale_date_end event tarixindən sonra ola bilməz",
    }
  );

export const bulkCreateEventsSchema = z
  .array(createEventSchema, { error: "Body array olmalıdır" })
  .min(1, "Ən azı bir event göndərilməlidir")
  .max(100, "Bir sorğuda maksimum 100 event yaradıla bilər");

export const eventQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category_id: z.string().regex(/^[1-9]\d*$/).optional(),
  venue_id: z.string().regex(/^[1-9]\d*$/).optional(),
  date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "date düzgün tarix olmalıdır",
  }).optional(),
  page: z.string().regex(/^[1-9]\d*$/).optional(),
  limit: z.string().regex(/^[1-9]\d*$/).optional(),
});
