import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import { signToken } from "../utils/jwt";
import { generateOTP, otpExpiry, isOtpExpired } from "../utils/otp";
import { sendVerificationOTP, sendPasswordResetOTP } from "../services/email.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Helper ─────────────────────────────────────────────────────────────────────
const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

// ════════════════════════════════════════════════════════════════════════════════
// POST /auth/register
// ════════════════════════════════════════════════════════════════════════════════
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, bio, email, phone, password } = req.body;

    if (!name || !surname || !email || !password) {
      respond(res, 400, { message: "name, surname, email and password are required" });
      return;
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      respond(res, 409, { message: "Email already registered" });
      return;
    }

    const otp = generateOTP();
    const otpExpiresAt = otpExpiry();

    const user = await User.create({
      name,
      surname,
      bio,
      email,
      phone,
      password,
      otp,
      otpExpiresAt,
    });

    await sendVerificationOTP(email, otp);

    respond(res, 201, {
      message: "Registered successfully. Check your email for the OTP.",
      user: user.toSafeJSON(),
    });
  } catch (err) {
    respond(res, 500, { message: "Registration failed", error: (err as Error).message });
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// POST /auth/verify-email
// ════════════════════════════════════════════════════════════════════════════════
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      respond(res, 404, { message: "User not found" });
      return;
    }

    if (user.isVerified) {
      respond(res, 400, { message: "Email already verified" });
      return;
    }

    if (user.otp !== otp || !user.otpExpiresAt || isOtpExpired(user.otpExpiresAt)) {
      respond(res, 400, { message: "Invalid or expired OTP" });
      return;
    }

    user.isVerified = true;
    user.otp = null as unknown as string;
    user.otpExpiresAt = null as unknown as Date;
    await user.save();

    const token = signToken({ id: user.id, email: user.email });
    respond(res, 200, { message: "Email verified", token, user: user.toSafeJSON() });
  } catch (err) {
    respond(res, 500, { message: "Verification failed", error: (err as Error).message });
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// POST /auth/resend-otp
// ════════════════════════════════════════════════════════════════════════════════
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      respond(res, 404, { message: "User not found" });
      return;
    }

    if (user.isVerified) {
      respond(res, 400, { message: "Email already verified" });
      return;
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = otpExpiry();
    await user.save();

    await sendVerificationOTP(email, otp);
    respond(res, 200, { message: "OTP resent to your email" });
  } catch (err) {
    respond(res, 500, { message: "Failed to resend OTP", error: (err as Error).message });
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// POST /auth/login
// ════════════════════════════════════════════════════════════════════════════════
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      respond(res, 400, { message: "Email and password required" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      respond(res, 401, { message: "Invalid credentials" });
      return;
    }

    if (!user.isVerified) {
      respond(res, 403, { message: "Please verify your email first" });
      return;
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      respond(res, 401, { message: "Invalid credentials" });
      return;
    }

    const token = signToken({ id: user.id, email: user.email });
    respond(res, 200, { message: "Login successful", token, user: user.toSafeJSON() });
  } catch (err) {
    respond(res, 500, { message: "Login failed", error: (err as Error).message });
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// POST /auth/forgot-password
// ════════════════════════════════════════════════════════════════════════════════
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Security: always return 200 to avoid email enumeration
      respond(res, 200, { message: "If that email exists, an OTP has been sent." });
      return;
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = otpExpiry();
    await user.save();

    await sendPasswordResetOTP(email, otp);
    respond(res, 200, { message: "Password reset OTP sent to your email." });
  } catch (err) {
    respond(res, 500, { message: "Failed to send reset OTP", error: (err as Error).message });
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// POST /auth/reset-password
// ════════════════════════════════════════════════════════════════════════════════
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      respond(res, 400, { message: "email, otp and newPassword are required" });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.otp !== otp || !user.otpExpiresAt || isOtpExpired(user.otpExpiresAt)) {
      respond(res, 400, { message: "Invalid or expired OTP" });
      return;
    }

    user.password = newPassword;   // hook hashes it automatically
    user.otp = null as unknown as string;
    user.otpExpiresAt = null as unknown as Date;
    await user.save();

    respond(res, 200, { message: "Password reset successfully" });
  } catch (err) {
    respond(res, 500, { message: "Reset failed", error: (err as Error).message });
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// POST /auth/google
// Body: { idToken: "..." }  — idToken comes from Google Sign-In on the client
// ════════════════════════════════════════════════════════════════════════════════
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      respond(res, 400, { message: "Google idToken is required" });
      return;
    }

    // Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      respond(res, 401, { message: "Invalid Google token" });
      return;
    }

    const { sub: googleId, email, given_name, family_name } = payload;

    // Find or create user
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // New user via Google — register
      user = await User.create({
        name: given_name || "Google",
        surname: family_name || "User",
        email,
        googleId,
        isVerified: true,   // Google already verified the email
      });
    } else if (!user.googleId) {
      // Existing email/password user — link Google account
      user.googleId = googleId as string;
      user.isVerified = true;
      await user.save();
    }

    const token = signToken({ id: user.id, email: user.email });
    respond(res, 200, {
      message: "Google auth successful",
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    respond(res, 500, { message: "Google auth failed", error: (err as Error).message });
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// GET /auth/me  (protected)
// ════════════════════════════════════════════════════════════════════════════════
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  respond(res, 200, { user: req.user!.toSafeJSON() });
};
