import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db";
import path from "path";

import fs from "fs";
import swaggerUi from "swagger-ui-express";
import SwaggerParser from "@apidevtools/swagger-parser";
import YAML from "yamljs";

import categoryRouter from "./routes/category.router";
import venueRoutes from "./routes/venue.router";
import eventRoutes from "./routes/event.router";
import authRoutes from "./routes/auth.router";
import userRoutes from "./routes/user.router";
import adminRoutes from "./routes/admin.router";
import seatingRoutes from "./routes/seating.router";
import ticketRoutes from "./routes/ticket.router";
import promoRoutes from "./routes/promocode.router";
import orderRoutes from "./routes/order.router";
import paymentRoutes from "./routes/payment.router";
import seatRoutes from "./routes/seat.router";
import eventSeatRoutes from "./routes/eventseat.router";

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
app.use("/api/seatings", seatingRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/event-seats", eventSeatRoutes);
app.use("/api/promocodes", promoRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (_req, res) => res.send("API is running..."));

const PORT = Number(process.env.PORT) || 3000;

async function setupSwagger() {
  try {
    const swaggerDocument = (await SwaggerParser.bundle(
      path.join(__dirname, "docs", "swagger.yaml")
    )) as any;

    const pathsDir = path.join(__dirname, "docs", "paths");
    const pathFiles = fs
      .readdirSync(pathsDir)
      .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"));

    let mergedPaths = { ...swaggerDocument.paths };
    for (const file of pathFiles) {
      const loaded = YAML.load(path.join(pathsDir, file));
      mergedPaths = { ...mergedPaths, ...loaded };
    }

    swaggerDocument.paths = mergedPaths;
    const schemasDir = path.join(__dirname, "docs", "schemas");
    const schemaFiles = fs
      .readdirSync(schemasDir)
      .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"));

    let mergedSchemas = { ...swaggerDocument.components?.schemas };
    for (const file of schemaFiles) {
      const loaded = YAML.load(path.join(schemasDir, file));

      if (loaded && typeof loaded === "object" && !loaded.type) {
        mergedSchemas = { ...mergedSchemas, ...loaded };
      } else {
        const name = path.basename(file, path.extname(file));
        const schemaName = name.charAt(0).toUpperCase() + name.slice(1);
        mergedSchemas[schemaName] = loaded;
      }
    }

    swaggerDocument.components = {
      ...swaggerDocument.components,
      schemas: mergedSchemas,
    };

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log("✅ Swagger docs loaded at /api-docs");
  } catch (error) {
    console.error("❌ Swagger bundling error:", error);
  }
}

async function bootstrap() {
  await setupSwagger();
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected");
      await sequelize.sync();
      console.log("✅ Models synced");
      await seedPermissions();
    } catch (error) {
      console.error("❌ Database connection error:", error);
      process.exit(1);
    }
  });
}

bootstrap();