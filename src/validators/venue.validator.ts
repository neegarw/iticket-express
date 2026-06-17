import { z } from 'zod';

export const venueSchema = z.object({
  name: z.string().min(1, 'Ad boş ola bilməz')
});