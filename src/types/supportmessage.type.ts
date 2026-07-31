import { Optional } from "sequelize";

export interface SupportMessageAttributes {
  id: number;
  ticketId: number;
  senderId: number;
  senderType: "user" | "agent";
  senderName: string;
  message: string;
  isRead: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface SupportMessageCreationAttributes
  extends Optional<
    SupportMessageAttributes,
    "id" | "isRead" | "created_at" | "updated_at"
  > {}