import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import { changePassword, deleteAccount, getAllUsers, getProfile, getUserById, updateProfile } from "../controller/user.controller";

const router = Router();

// ── All routes require authentication ─────────────────────────────────────────
router.use(protect);

router.get("/profile",          getProfile);
router.put("/profile",          updateProfile);
router.put("/change-password",  changePassword);
router.delete("/profile",       deleteAccount);

// (Admin) list all users / get by id
router.get("/",     getAllUsers);
router.get("/:id",  getUserById);

export default router;
