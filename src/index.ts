import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/productRoute";
import uploadImageRoutes from "./routes/uploadImage";
import reviewProductRoutes from "./routes/reviewProducts";
import userStatsRoutes from "./routes/userStats";
import { APP_CONFIG } from "./config/app";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({ origin: "https://plypicker-zeta.vercel.app/login", credentials: true })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", uploadImageRoutes);
app.use("/api", reviewProductRoutes);
app.use("/api", userStatsRoutes);

mongoose
  .connect(APP_CONFIG.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/uploads", express.static("uploads"));

app.listen(APP_CONFIG.PORT, () => {
  console.log(`Server is running on port ${APP_CONFIG.PORT}`);
});
