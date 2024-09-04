import jwt from "jsonwebtoken";
import { VALIDATED_CONFIG } from "../config/app";

export const generateToken = (
  userId: string,
  role: string,
  email: string
): string => {
  const payload = {
    user: {
      id: userId,
      role: role,
      email: email,
    },
  };

  return jwt.sign(payload, VALIDATED_CONFIG.JWT_SECRET, { expiresIn: "1h" });
};
