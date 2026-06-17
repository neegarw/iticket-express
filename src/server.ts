import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";

import categoryRouter from "./routes/category.router";
import venueRoutes from './routes/venue.router';
import eventRoutes from './routes/event.router';

import './models';

dotenv.config();

const app = express();

app.use(express.json());

// ROUTES //
app.use("/api/categories", categoryRouter);
app.use('/api/venues', venueRoutes);
app.use('/api/events', eventRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});


sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });