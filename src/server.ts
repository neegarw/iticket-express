import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";

import categoryRouter from "./routes/category.router";
import venueRoutes from "./routes/venue.router";
import eventRoutes from "./routes/event.router";

import "./models";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/categories", categoryRouter);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Models synced");
  } catch (error) {
    console.log("Database connection error:", error);
  }
});