import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db";
import path from "path";

import categoryRouter from "./routes/category.router";
import venueRoutes from "./routes/venue.router";
import eventRoutes from "./routes/event.router";
import authRoutes from "./routes/auth.router";
import userRoutes from "./routes/user.router";
import adminRoutes from "./routes/admin.router";
import seatRoutes from "./routes/seating.router";
import ticketRoutes from "./routes/ticket.router";
import promoRoutes from "./routes/promocode.router";
import orderRoutes from "./routes/order.router";
import paymentRoutes from "./routes/payment.router";

import { seedPermissions } from "./seeders/permission.seeder";

import "./models";

dotenv.config();

const app = express();

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
  res.render("auth", { googleClientId: process.env.GOOGLE_CLIENT_ID });
});

app.use("/api/categories", categoryRouter);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seatings", seatRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/promocodes", promoRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (_req, res) => res.send("API is running..."));

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync({ alter: true });
    console.log("✅ Models synced");
    await seedPermissions();
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
});