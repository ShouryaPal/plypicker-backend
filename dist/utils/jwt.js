"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../config/app");
const generateToken = (userId, role, email) => {
    const payload = {
        user: {
            id: userId,
            role: role,
            email: email,
        },
    };
    return jsonwebtoken_1.default.sign(payload, app_1.VALIDATED_CONFIG.JWT_SECRET, { expiresIn: "1h" });
};
exports.generateToken = generateToken;
