import { z } from 'zod';

export const eventSchema = z.object({
  name: z.string().min(1, 'Ad boş ola bilməz'),
  description: z.string().optional(),
  date: z.string().min(1, 'Tarix boş ola bilməz'),
  sale_date_end: z.string().min(1, 'Satış tarixi boş ola bilməz'),
  category_id: z.number().min(1, 'Category seçilməlidir'),
  venue_id: z.number().min(1, 'Venue seçilməlidir'),
  minimum_age: z.number().min(0).default(0),
  image_url: z.string().url().optional()
});