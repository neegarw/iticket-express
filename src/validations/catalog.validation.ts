import { z } from "zod";
import { nonEmptyUpdate, optionalIdQuery } from "./common.validation";

const categoryFields = {
  name_az: z.string().trim().min(2).max(100),
  name_ru: z.string().trim().min(2).max(100),
  name_en: z.string().trim().min(2).max(100),
  is_active: z.boolean().optional(),
};
export const createCategorySchema = z.object(categoryFields);
export const updateCategorySchema = nonEmptyUpdate(categoryFields);
export const bulkCategorySchema = z.array(createCategorySchema).min(1).max(100);
export const categoryQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  page: z.string().regex(/^[1-9]\d*$/).optional(),
  limit: z.string().regex(/^[1-9]\d*$/).optional(),
});

const venueFields = { name: z.string().trim().min(2).max(150) };
export const createVenueSchema = z.object(venueFields);
export const updateVenueSchema = nonEmptyUpdate(venueFields);
export const bulkVenueSchema = z.array(createVenueSchema).min(1).max(100);
export const venueQuerySchema = z.object({ search: z.string().trim().max(100).optional() });

const seatingFields = {
  name: z.string().trim().min(1).max(100),
  venue_id: z.coerce.number().int().positive(),
};
export const createSeatingSchema = z.object(seatingFields);
export const updateSeatingSchema = nonEmptyUpdate(seatingFields);
export const bulkSeatingSchema = z.array(createSeatingSchema).min(1).max(500);
export const seatingQuerySchema = z.object({ venue_id: optionalIdQuery });

const seatFields = {
  row: z.string().trim().min(1).max(20),
  seat_number: z.coerce.number().int().positive().max(100000),
  seating_id: z.coerce.number().int().positive(),
};
export const createSeatSchema = z.object(seatFields);
export const updateSeatSchema = nonEmptyUpdate(seatFields);
export const bulkSeatSchema = z.array(createSeatSchema).min(1).max(1000);
export const seatQuerySchema = z.object({ seating_id: optionalIdQuery });

const eventSeatFields = {
  event_id: z.coerce.number().int().positive(),
  seat_id: z.coerce.number().int().positive(),
  price: z.coerce.number().positive().max(1000000),
  status: z.enum(["available", "sold"]).optional(),
};
export const createEventSeatSchema = z.object(eventSeatFields);
export const updateEventSeatSchema = nonEmptyUpdate(eventSeatFields);
export const bulkEventSeatSchema = z.array(createEventSeatSchema).min(1).max(1000);
export const eventSeatQuerySchema = z.object({
  event_id: optionalIdQuery,
  seat_id: optionalIdQuery,
  status: z.enum(["available", "sold"]).optional(),
});
