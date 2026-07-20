import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import { forgotPassword, getMe, googleAuth, login, logout, register, resendOtp, resetPassword, verifyEmail } from "../controllers/auth.controller";

const router = Router();

// ── Public ─────────────────────────────────────────────────────────────────────
router.post("/register",         register);
router.post("/verify-email",     verifyEmail);
router.post("/resend-otp",       resendOtp);
router.post("/login",            login);
router.post("/forgot-password",  forgotPassword);
router.post("/reset-password",   resetPassword);
router.post("/google",           googleAuth);
router.post("/logout", protect, logout);

// ── Protected ──────────────────────────────────────────────────────────────────
router.get("/me", protect, getMe);

export default router;
