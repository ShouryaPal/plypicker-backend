"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.PORT = exports.JWT_SECRET = exports.MONGODB_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.PORT = process.env.PORT || 5000;
exports.NODE_ENV = process.env.NODE_ENV || "development";
if (!exports.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in the environment variables");
}
if (!exports.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
