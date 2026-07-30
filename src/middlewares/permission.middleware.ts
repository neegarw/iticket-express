import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import Permission from "../models/permission.model";
import AdminPermission from "../models/adminPermisson";

export const requirePermission = (permissionKey: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ success: false, message: "Giriş tələb olunur" });
        return;
      }

      // Superadmin hər şeyə icazəlidir
      if (user.role === "superadmin") {
        next();
        return;
      }

      if (user.role !== "admin") {
        res.status(403).json({ success: false, message: "İcazəniz yoxdur" });
        return;
      }

      const permission = await Permission.findOne({ where: { key: permissionKey } });
      if (!permission) {
        res.status(500).json({ success: false, message: "Permission tapılmadı: " + permissionKey });
        return;
      }

      const hasPermission = await AdminPermission.findOne({
        where: { adminId: user.id, permissionId: permission.id },
      });

      if (!hasPermission) {
        res.status(403).json({ success: false, message: "Support idarə etmək üçün icazəniz yoxdur" });
        return;
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, message: "Xəta", error: (err as Error).message });
    }
  };
};