"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../config/app");
const auth = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, app_1.VALIDATED_CONFIG.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
exports.auth = auth;
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Access denied. Admin only." });
    }
};
exports.adminOnly = adminOnly;
