import { z } from 'zod';

export const categorySchema = z.object({
  name_az: z.string().min(1, 'Azerbaycanca ad boş ola bilməz'),
  name_ru: z.string().min(1, 'Rusca ad boş ola bilməz'),
  name_en: z.string().min(1, 'İngiliscə ad boş ola bilməz'),
  is_active: z.boolean().default(true)
});