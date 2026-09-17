import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import { forgotPassword, getMe, googleAuth, login, logout, register, resendOtp, resetPassword, verifyEmail } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { emailSchema, googleAuthSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema } from "../validations/auth.validation";

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────────
router.post("/register",         validate(registerSchema), register);
router.post("/verify-email",     validate(verifyEmailSchema), verifyEmail);
router.post("/resend-otp",       validate(emailSchema), resendOtp);
router.post("/login",            validate(loginSchema), login);
router.post("/forgot-password",  validate(emailSchema), forgotPassword);
router.post("/reset-password",   validate(resetPasswordSchema), resetPassword);
router.post("/google",           validate(googleAuthSchema), googleAuth);
router.post("/logout", protect, logout);

// ── Protected ──────────────────────────────────────────────────────────────────
router.get("/me", protect, getMe);

export default router;
