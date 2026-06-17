import { Category } from './category.model';
import { Venue } from './venue.model';
import { Event } from './event.model';

// ─── Category → Event ───────────────────────────
// One to Many: bir category-nin çox eventi ola bilər
Category.hasMany(Event, { foreignKey: 'category_id' });
Event.belongsTo(Category, { foreignKey: 'category_id' });

// ─── Venue → Event ──────────────────────────────
// One to Many: bir venue-də çox event keçirilə bilər
Venue.hasMany(Event, { foreignKey: 'venue_id' });
Event.belongsTo(Venue, { foreignKey: 'venue_id' });

export { Category, Venue, Event };