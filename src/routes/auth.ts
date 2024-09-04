import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("role")
      .isIn(["admin", "team member"])
      .withMessage('Role must be either "admin" or "team member"'),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password").exists().withMessage("Password is required"),
  ],
  login
);

export default router;
