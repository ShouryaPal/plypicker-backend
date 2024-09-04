"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/register", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Enter a valid email address"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("role")
        .isIn(["admin", "team member"])
        .withMessage('Role must be either "admin" or "team member"'),
], authController_1.register);
router.post("/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Enter a valid email address"),
    (0, express_validator_1.body)("password").exists().withMessage("Password is required"),
], authController_1.login);
exports.default = router;
