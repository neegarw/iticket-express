import Permission from "../models/permission.model";

const permissions = [
  { key: "create_event",     description: "Tədbir yarat" },
  { key: "edit_event",       description: "Tədbiri redaktə et" },
  { key: "delete_event",     description: "Tədbiri sil" },
  { key: "create_venue",     description: "Məkan yarat" },
  { key: "edit_venue",       description: "Məkanı redaktə et" },
  { key: "delete_venue",     description: "Məkanı sil" },
  { key: "create_category",  description: "Kateqoriya yarat" },
  { key: "edit_category",    description: "Kateqoriyanı redaktə et" },
  { key: "delete_category",  description: "Kateqoriyanı sil" },
  { key: "manage_seats",     description: "Oturacaqları idarə et" },
  { key: "manage_tickets",   description: "Biletləri idarə et" },
  { key: "manage_orders",    description: "Sifarişləri idarə et" },
  { key: "manage_promocodes",description: "Promo kodları idarə et" },
  { key: "manage_users",     description: "İstifadəçiləri idarə et" },
  { key: "view_payments",    description: "Ödənişlərə bax" },
  { key: "manage_support",   description: "Dəstək sorğularını idarə et" },
] as const;

export const seedPermissions = async (): Promise<void> => {
  for (const perm of permissions) {
    await Permission.findOrCreate({
      where: { key: perm.key },
      defaults: perm,
    });
  }
  console.log("✅ Permissions seeded");
};
