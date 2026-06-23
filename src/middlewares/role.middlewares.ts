import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import Permission, { PermissionKey } from "../models/permission.model";
import AdminPermission from "../models/adminPermisson";

// ─── Yalnız müəyyən role-lara icazə ver ────────────────────────────────────────
// Misal: requireRole("superadmin")
//        requireRole("superadmin", "admin")
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Bu əməliyyat üçün icazəniz yoxdur. Lazımi rol: ${roles.join(" və ya ")}`,
      });
      return;
    }

    next();
  };
};

// ─── Superadmin HƏR ŞEYİ edə bilər ────────────────────────────────────────────
// Admin isə yalnız ona verilmiş permission-lar əsasında
// Misal: requirePermission("create_event")
export const requirePermission = (permission: PermissionKey) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Superadmin hər şeyi edə bilər
    if (req.user.role === "superadmin") {
      next();
      return;
    }

    // Admin deyilsə rədd et
    if (req.user.role !== "admin") {
      res.status(403).json({ success: false, message: "Admin səlahiyyəti lazımdır" });
      return;
    }

    // Adminin bu permission-u varmı?
    const perm = await Permission.findOne({ where: { key: permission } });
    if (!perm) {
      res.status(403).json({ success: false, message: "İcazə mövcud deyil" });
      return;
    }

    const granted = await AdminPermission.findOne({
      where: { adminId: req.user.id, permissionId: perm.id },
    });

    if (!granted) {
      res.status(403).json({
        success: false,
        message: `"${permission}" icazəniz yoxdur`,
      });
      return;
    }

    next();
  };
};
