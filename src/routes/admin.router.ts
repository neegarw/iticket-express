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
import { validate } from "../middlewares/validate";
import { permissionBodySchema } from "../validations/admin-support.validation";
import { adminIdParamSchema, userIdParamSchema } from "../validations/common.validation";
const router = Router();


// Hamısı: login + superadmin
router.use(protect, requireRole("superadmin"));

router.get("/admins",                    getAllAdmins);
router.get("/permissions/:adminId",      validate(adminIdParamSchema, "params"), getAdminPermissions);
router.patch("/make-admin/:userId",      validate(userIdParamSchema, "params"), makeAdmin);
router.patch("/remove-admin/:userId",    validate(userIdParamSchema, "params"), removeAdmin);
router.post("/grant-permission",         validate(permissionBodySchema), grantPermission);
router.delete("/revoke-permission",      validate(permissionBodySchema), revokePermission);

export default router;
