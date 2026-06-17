import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

interface EventAttributes {
  id: number;
  name: string;
  description: string;
  date: Date;
  sale_date_end: Date;
  category_id: number;
  venue_id: number;
  minimum_age: number;
  image_url: string;
}

export class Event extends Model<EventAttributes> implements EventAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public date!: Date;
  public sale_date_end!: Date;
  public category_id!: number;
  public venue_id!: number;
  public minimum_age!: number;
  public image_url!: string;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    sale_date_end: {
      type: DataTypes.DATE,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    venue_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minimum_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'events',
    timestamps: false
  }
);

export default Event;