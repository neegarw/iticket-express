import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import { forgotPassword, getMe, googleAuth, login, register, resendOtp, resetPassword, verifyEmail } from "../controller/auth.controller";

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────────
router.post("/register",         register);
router.post("/verify-email",     verifyEmail);
router.post("/resend-otp",       resendOtp);
router.post("/login",            login);
router.post("/forgot-password",  forgotPassword);
router.post("/reset-password",   resetPassword);
router.post("/google",           googleAuth);

// ── Protected ──────────────────────────────────────────────────────────────────
router.get("/me", protect, getMe);

export default router;
