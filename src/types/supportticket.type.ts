import { Optional } from "sequelize";

export interface SupportTicketAttributes {
  id: number;
  userId: number;
  subject: string;
  status: "open" | "resolved" | "closed";
  rating: number | null;
  ratingComment: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface SupportTicketCreationAttributes
  extends Optional<
    SupportTicketAttributes,
    | "id"
    | "status"
    | "rating"
    | "ratingComment"
    | "created_at"
    | "updated_at"
  > {}