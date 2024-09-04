"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATED_CONFIG = exports.APP_CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.APP_CONFIG = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    // Add other configuration variables as needed
};
// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
for (const envVar of requiredEnvVars) {
    if (!exports.APP_CONFIG[envVar]) {
        throw new Error(`${envVar} is not defined in the environment variables`);
    }
}
// Type assertion after validation
exports.VALIDATED_CONFIG = exports.APP_CONFIG;
