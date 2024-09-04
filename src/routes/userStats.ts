import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Review from "../models/reviewProducts";
import User, { IUser } from "../models/User";

const router = express.Router();

async function getTeamMemberStats(userId: string) {
  const reviews = await Review.find({ personId: userId });
  return {
    totalRequests: reviews.length,
    approvedRequests: reviews.filter((review) => review.status === "approved")
      .length,
    rejectedRequests: reviews.filter((review) => review.status === "rejected")
      .length,
    pendingRequests: reviews.filter((review) => review.status === "pending")
      .length,
  };
}

async function getAdminStats() {
  const totalReviews = await Review.find();
  return {
    totalRequests: totalReviews.length,
    approvedRequests: totalReviews.filter(
      (review) => review.status === "approved"
    ).length,
    rejectedRequests: totalReviews.filter(
      (review) => review.status === "rejected"
    ).length,
    pendingRequests: totalReviews.filter(
      (review) => review.status === "pending"
    ).length,
  };
}
router.get("/user-stats/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let stats;
    if (user.role === "team member") {
      stats = await getTeamMemberStats(userId);
    } else if (user.role === "admin") {
      stats = await getAdminStats();
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    res.status(200).json({
      userId: user._id,
      email: user.email,
      role: user.role,
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
