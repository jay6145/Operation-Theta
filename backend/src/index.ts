import express from "express";
import cors from "cors";
import { config, validateEnv } from "./config/env";
import missionRoutes from "./routes/missions";
import userRoutes from "./routes/users";

// Validate environment variables
validateEnv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Operation Theta Backend is running" });
});

// Routes
app.use("/missions", missionRoutes);
app.use("/users", userRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
});
