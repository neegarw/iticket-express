import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middlewares";
import {
  makeAdmin,
  removeAdmin,
  grantPermission,
  revokePermission,
  getAdminPermissions,
  getAllAdmins,
} from "../controllers/admin.controller"; 
const router = Router();


// Hamısı: login + superadmin
router.use(protect, requireRole("superadmin"));

router.get("/admins",                    getAllAdmins);
router.get("/permissions/:adminId",      getAdminPermissions);
router.patch("/make-admin/:userId",      makeAdmin);
router.patch("/remove-admin/:userId",    removeAdmin);
router.post("/grant-permission",         grantPermission);
router.delete("/revoke-permission",      revokePermission);

export default router;
