import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db";

import categoryRouter from "./routes/category.router";
import venueRoutes from "./routes/venue.router";
import eventRoutes from "./routes/event.router";
import authRoutes from "./routes/auth.router";
import userRoutes from "./routes/user.router";

import path from "path";

import "./models";

dotenv.config();

const app = express();

// ─── Middlewares ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/test-auth", (_req, res) => {
  res.render("auth", {
    googleClientId: process.env.GOOGLE_CLIENT_ID
  });
});

// ─── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/categories", categoryRouter);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ─── Health check ───────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send("API is running...");
});

// ─── 404 handler ────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Start ───────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ alter: true });
    console.log("✅ Models synced");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
});