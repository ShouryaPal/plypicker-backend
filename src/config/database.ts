import dotenv from "dotenv";

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}
