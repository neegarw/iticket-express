import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
  console.log(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_HOST

  )

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  '',
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);


export default sequelize;