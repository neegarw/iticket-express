import { z } from "zod";

const email = z.string().trim().email("Düzgün email daxil edin").max(255);
const strongPassword = z
  .string()
  .min(8, "Parol ən azı 8 simvol olmalıdır")
  .max(72, "Parol ən çoxu 72 simvol ola bilər")
  .regex(/[A-Za-z]/, "Parolda ən azı bir hərf olmalıdır")
  .regex(/\d/, "Parolda ən azı bir rəqəm olmalıdır");
const otp = z.string().regex(/^\d{6}$/, "OTP 6 rəqəmdən ibarət olmalıdır");

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  surname: z.string().trim().min(2).max(100),
  bio: z.string().trim().max(500).optional(),
  email,
  phone: z.string().trim().min(5).max(20).optional(),
  password: strongPassword,
});

export const emailSchema = z.object({ email });
export const verifyEmailSchema = z.object({ email, otp });
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "password mütləqdir").max(72),
});
export const resetPasswordSchema = z.object({
  email,
  otp,
  newPassword: strongPassword,
});
export const googleAuthSchema = z.object({
  idToken: z.string().trim().min(20, "Google idToken düzgün deyil"),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    surname: z.string().trim().min(2).max(100).optional(),
    bio: z.string().trim().max(500).optional(),
    phone: z.string().trim().min(5).max(20).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, {
    message: "Yeniləmək üçün ən azı bir sahə göndərilməlidir",
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "currentPassword mütləqdir").max(72),
  newPassword: strongPassword,
});
