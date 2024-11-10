"use-strict";
import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";

import { sequelize, connectDB } from "./config/sequelize.js";
import logger from "./config/logger.js";

dotenv.config();

const app = express();

// Middleware
app.disable("x-powered-by");
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(":method :url :status - :response-time ms"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));

// Static files
app.use(express.static(path.join(__dirname, "public")), (req, res, next) => {
  console.log("Request URL:", req.url); // Log the requested URL
  next();
});

// Test route
app.get("/", (req, res) => {
  res.render("login");
});

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });

    // Log database connection success
    logger.info("Database connection established successfully.");

    const PORT = process.env.PORT || 4001;
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error during server startup: ${error.message}`);
    process.exit(1);
  }
})();
