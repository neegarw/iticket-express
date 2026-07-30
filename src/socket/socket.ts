import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Permission from "../models/permission.model";
import AdminPermission from "../models/adminPermisson";
import * as SupportService from "../services/support.service";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, { cors: { origin: "*" } });

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Token yoxdur"));
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      const user = await User.findByPk(decoded.id);
      if (!user) return next(new Error("İstifadəçi tapılmadı"));
      (socket as any).currentUser = user;
      next();
    } catch {
      next(new Error("Token yanlışdır"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = (socket as any).currentUser;

    socket.on("join_ticket", (ticketId: number) => {
      socket.join(`ticket_${ticketId}`);
    });

    socket.on("send_message", async (data: { ticketId: number; text: string }) => {
      let senderType: "user" | "agent" = "user";

      if (user.role === "superadmin") {
        senderType = "agent";
      } else if (user.role === "admin") {
        const permission = await Permission.findOne({ where: { key: "manage_support" } });
        const hasPermission =
          permission &&
          (await AdminPermission.findOne({
            where: { adminId: user.id, permissionId: permission.id },
          }));
        if (!hasPermission) return; // icazəsi yoxdursa sakitcə ignor et
        senderType = "agent";
      }

      const senderName = `${user.name} ${user.surname || ""}`.trim();

      const message = await SupportService.addMessage(
        data.ticketId,
        user.id,
        senderType,
        senderName,
        data.text
      );

      io.to(`ticket_${data.ticketId}`).emit("new_message", message);
    });

    socket.on("disconnect", () => {});
  });
  
};
export const notifyTicketStatus = (ticketId: number, status: string) => {
  io.to(`ticket_${ticketId}`).emit("ticket_status_changed", { ticketId, status });
};

export const getIO = () => io;