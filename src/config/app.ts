import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  // Add other configuration variables as needed
}

export const APP_CONFIG: AppConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  // Add other configuration variables as needed
};

// Validate required environment variables
const requiredEnvVars: (keyof AppConfig)[] = ["MONGODB_URI", "JWT_SECRET"];
for (const envVar of requiredEnvVars) {
  if (!APP_CONFIG[envVar]) {
    throw new Error(`${envVar} is not defined in the environment variables`);
  }
}

// Type assertion after validation
export const VALIDATED_CONFIG = APP_CONFIG as Required<AppConfig>;
