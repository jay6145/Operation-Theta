import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5050,
  nodeEnv: process.env.NODE_ENV || "development",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "operation-theta",
};

// Validate required environment variables
export function validateEnv() {
  // Add any required env validation here
  console.log("✅ Environment variables validated");
}
