// config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: (msg) => logger.info(msg),
  }
);

// Function to authenticate and initialize the database connection
async function connectDB() {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
}

export { sequelize, connectDB };
