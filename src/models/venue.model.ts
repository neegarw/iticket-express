import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import { VenueAttributes, VenueCreationAttributes } from "../types/venue.type";

export class Venue
  extends Model<VenueAttributes, VenueCreationAttributes>
  implements VenueAttributes
{
  public id!: number;
  public name!: string;
}

Venue.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, tableName: "venues", timestamps: false }
);

export default Venue;