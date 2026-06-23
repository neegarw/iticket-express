import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

// GET /users/profile  → öz profilini gör
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  respond(res, 200, { user: req.user!.toSafeJSON() });
};

// PUT /users/profile  → öz profilini yenilə
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, surname, bio, phone } = req.body;
    const user = req.user!;

    if (name)    user.name    = name;
    if (surname) user.surname = surname;
    if (bio)     user.bio     = bio;
    if (phone)   user.phone   = phone;

    await user.save();
    respond(res, 200, { message: "Profile updated", user: user.toSafeJSON() });
  } catch (err) {
    respond(res, 500, { message: "Update failed", error: (err as Error).message });
  }
};

// PUT /users/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user!;

    if (!user.password) {
      respond(res, 400, { message: "This account uses Google login — no password to change" });
      return;
    }

    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
      respond(res, 401, { message: "Current password is incorrect" });
      return;
    }

    user.password = newPassword;
    await user.save();
    respond(res, 200, { message: "Password changed successfully" });
  } catch (err) {
    respond(res, 500, { message: "Password change failed", error: (err as Error).message });
  }
};

// DELETE /users/profile
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await req.user!.destroy();
    respond(res, 200, { message: "Account deleted successfully" });
  } catch (err) {
    respond(res, 500, { message: "Delete failed", error: (err as Error).message });
  }
};

// ─── Admin-only endpoints ───────────────────────────────────────────────────────

// GET /users  → bütün userləri gör
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otp", "otpExpiresAt", "googleId"] },
    });
    respond(res, 200, { users });
  } catch (err) {
    respond(res, 500, { message: "Failed to fetch users", error: (err as Error).message });
  }
};

// GET /users/:id
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(Number(req.params.id), {
      attributes: { exclude: ["password", "otp", "otpExpiresAt", "googleId"] },
    });
    if (!user) {
      respond(res, 404, { message: "User not found" });
      return;
    }
    respond(res, 200, { user });
  } catch (err) {
    respond(res, 500, { message: "Failed to fetch user", error: (err as Error).message });
  }
};
