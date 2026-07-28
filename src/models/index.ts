import { Category } from "./category.model";
import { Venue } from "./venue.model";
import { Event } from "./event.model";
import { Seating } from "./seating.model";
import { Seat } from "./seat.model";
import { EventSeat } from "./eventseat.model";
import { Ticket } from "./ticket.model";
import { PromoCode } from "./promocode.model";
import { Order } from "./order.model";
import { Payment } from "./payment.model";
import User from "./user.model";
import Permission from "./permission.model";
import AdminPermission from "./adminPermisson";

// ─── Category → Event ───────────────────────────
Category.hasMany(Event, { foreignKey: "category_id" });
Event.belongsTo(Category, { foreignKey: "category_id" });

// ─── Venue → Event ──────────────────────────────
Venue.hasMany(Event, { foreignKey: "venue_id" });
Event.belongsTo(Venue, { foreignKey: "venue_id" });

// ─── Venue → Seating ────────────────────────────
Venue.hasMany(Seating, { foreignKey: "venue_id" });
Seating.belongsTo(Venue, { foreignKey: "venue_id" });

// ─── Seating → Seat ─────────────────────────────
Seating.hasMany(Seat, { foreignKey: "seating_id" });
Seat.belongsTo(Seating, { foreignKey: "seating_id" });

// ─── Event → EventSeat ──────────────────────────
Event.hasMany(EventSeat, { foreignKey: "event_id" });
EventSeat.belongsTo(Event, { foreignKey: "event_id" });

// ─── Seat → EventSeat ───────────────────────────
Seat.hasMany(EventSeat, { foreignKey: "seat_id" });
EventSeat.belongsTo(Seat, { foreignKey: "seat_id" });

// ─── EventSeat → Ticket ─────────────────────────
EventSeat.hasOne(Ticket, { foreignKey: "event_seat_id" });
Ticket.belongsTo(EventSeat, { foreignKey: "event_seat_id" });

// ─── Event → PromoCode ──────────────────────────
Event.hasMany(PromoCode, { foreignKey: "event_id" });
PromoCode.belongsTo(Event, { foreignKey: "event_id" });

// ─── User → Order ───────────────────────────────
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// ─── PromoCode → Order ──────────────────────────
PromoCode.hasMany(Order, { foreignKey: "promocode_id" });
Order.belongsTo(PromoCode, { foreignKey: "promocode_id" });

// ─── Order → Ticket ─────────────────────────────
Order.hasMany(Ticket, { foreignKey: "order_id" });
Ticket.belongsTo(Order, { foreignKey: "order_id" });

// ─── Order → Payment ────────────────────────────
Order.hasOne(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

// ─── Admin Permissions ──────────────────────────
User.belongsToMany(Permission, {
  through: AdminPermission,
  foreignKey: "adminId",
  as: "permissions",
});

Permission.belongsToMany(User, {
  through: AdminPermission,
  foreignKey: "permissionId",
  as: "admins",
});

export {
  User,
  Permission,
  AdminPermission,
  Category,
  Venue,
  Event,
  Seating,
  Seat,
  EventSeat,
  Ticket,
  PromoCode,
  Order,
  Payment,
};