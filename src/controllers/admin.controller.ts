import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Permission from "../models/permission.model";
import AdminPermission from "../models/adminPermisson";

const respond = (res: Response, status: number, data: object) =>
  res.status(status).json({ success: status < 400, ...data });

export const makeAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(Number(req.params.userId));
    if (!user) { respond(res, 404, { message: "İstifadəçi tapılmadı" }); return; }
    if (user.role === "superadmin") { respond(res, 400, { message: "Superadmin dəyişdirilə bilməz" }); return; }
    user.role = "admin";
    await user.save();
    respond(res, 200, { message: `${user.email} admin edildi`, user: user.toSafeJSON() });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const removeAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(Number(req.params.userId));
    if (!user) { respond(res, 404, { message: "İstifadəçi tapılmadı" }); return; }
    if (user.role === "superadmin") { respond(res, 400, { message: "Superadmin dəyişdirilə bilməz" }); return; }
    user.role = "user";
    await user.save();
    await AdminPermission.destroy({ where: { adminId: user.id } });
    respond(res, 200, { message: `${user.email} user edildi` });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const grantPermission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { adminId, permissionKey } = req.body;
    const admin = await User.findByPk(Number(adminId));
    if (!admin || admin.role !== "admin") { respond(res, 400, { message: "Yalnız adminlərə icazə verilə bilər" }); return; }
    const permission = await Permission.findOne({ where: { key: permissionKey } });
    if (!permission) { respond(res, 404, { message: "İcazə tapılmadı" }); return; }
    const [, created] = await AdminPermission.findOrCreate({
      where: { adminId: Number(adminId), permissionId: permission.id },
      defaults: { adminId: Number(adminId), permissionId: permission.id, grantedBy: req.user!.id },
    });
    respond(res, 200, { message: created ? "İcazə verildi" : "Bu icazə artıq mövcuddur", permission: permissionKey });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const revokePermission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { adminId, permissionKey } = req.body;
    const permission = await Permission.findOne({ where: { key: permissionKey } });
    if (!permission) { respond(res, 404, { message: "İcazə tapılmadı" }); return; }
    const deleted = await AdminPermission.destroy({ where: { adminId, permissionId: permission.id } });
    respond(res, 200, { message: deleted ? "İcazə alındı" : "Bu icazə mövcud deyildi" });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const getAdminPermissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await User.findByPk(Number(req.params.adminId), {
      include: [{ model: Permission, as: "permissions", attributes: ["key", "description"] }],
    });
    if (!admin) { respond(res, 404, { message: "Admin tapılmadı" }); return; }
    respond(res, 200, { admin: admin.toSafeJSON(), permissions: (admin as any).permissions });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};

export const getAllAdmins = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admins = await User.findAll({
      where: { role: "admin" },
      include: [{ model: Permission, as: "permissions", attributes: ["key"] }],
      attributes: { exclude: ["password", "otp", "otpExpiresAt", "googleId"] },
    });
    respond(res, 200, { admins });
  } catch (err) {
    respond(res, 500, { message: "Xəta", error: (err as Error).message });
  }
};
