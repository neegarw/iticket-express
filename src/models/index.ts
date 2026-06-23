import { Category } from './category.model';
import { Venue } from './venue.model';
import { Event } from './event.model';
import { Seating } from './seating.model';
import { Ticket } from './ticket.model';
import { PromoCode } from './promocode.model';
import { Order } from './order.model';
import { SoldTicket } from './soldticket.model';
import { Payment } from './payment.model';
import User from './user.model';
import Permission from './permission.model';
import AdminPermission from './adminPermisson';

// ─── Category → Event ───────────────────────────
Category.hasMany(Event, { foreignKey: 'category_id' });
Event.belongsTo(Category, { foreignKey: 'category_id' });

// ─── Venue → Event ──────────────────────────────
Venue.hasMany(Event, { foreignKey: 'venue_id' });
Event.belongsTo(Venue, { foreignKey: 'venue_id' });

// ─── Venue → Seating ────────────────────────────
Venue.hasMany(Seating, { foreignKey: 'venue_id' });
Seating.belongsTo(Venue, { foreignKey: 'venue_id' });

// ─── Seating → Ticket ───────────────────────────
Seating.hasMany(Ticket, { foreignKey: 'seating_id' });
Ticket.belongsTo(Seating, { foreignKey: 'seating_id' });

// ─── Venue → Ticket ─────────────────────────────
Venue.hasMany(Ticket, { foreignKey: 'venue_id' });
Ticket.belongsTo(Venue, { foreignKey: 'venue_id' });

// ─── Event → PromoCode ──────────────────────────
Event.hasMany(PromoCode, { foreignKey: 'event_id' });
PromoCode.belongsTo(Event, { foreignKey: 'event_id' });

// ─── User → Order ───────────────────────────────
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// ─── Seating → Order ────────────────────────────
Seating.hasMany(Order, { foreignKey: 'seating_id' });
Order.belongsTo(Seating, { foreignKey: 'seating_id' });

// ─── PromoCode → Order ──────────────────────────
PromoCode.hasMany(Order, { foreignKey: 'promocode_id' });
Order.belongsTo(PromoCode, { foreignKey: 'promocode_id' });

// ─── Order → SoldTicket ─────────────────────────
Order.hasMany(SoldTicket, { foreignKey: 'order_id' });
SoldTicket.belongsTo(Order, { foreignKey: 'order_id' });

// ─── Seating → SoldTicket ───────────────────────
Seating.hasMany(SoldTicket, { foreignKey: 'seating_id' });
SoldTicket.belongsTo(Seating, { foreignKey: 'seating_id' });

// ─── Order → Payment ────────────────────────────
Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// ─── Admin Permissions ──────────────────────────
User.belongsToMany(Permission, {
  through: AdminPermission,
  foreignKey: 'adminId',
  as: 'permissions',
});
Permission.belongsToMany(User, {
  through: AdminPermission,
  foreignKey: 'permissionId',
  as: 'admins',
});

export {
  User, Permission, AdminPermission,
  Category, Venue, Event,
  Seating, Ticket, PromoCode,
  Order, SoldTicket, Payment,
};
