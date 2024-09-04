"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const reviewProducts_1 = __importDefault(require("../models/reviewProducts"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
async function getTeamMemberStats(userId) {
    const reviews = await reviewProducts_1.default.find({ personId: userId });
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
    const totalReviews = await reviewProducts_1.default.find();
    return {
        totalRequests: totalReviews.length,
        approvedRequests: totalReviews.filter((review) => review.status === "approved").length,
        rejectedRequests: totalReviews.filter((review) => review.status === "rejected").length,
        pendingRequests: totalReviews.filter((review) => review.status === "pending").length,
    };
}
router.get("/user-stats/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let stats;
        if (user.role === "team member") {
            stats = await getTeamMemberStats(userId);
        }
        else if (user.role === "admin") {
            stats = await getAdminStats();
        }
        else {
            return res.status(400).json({ message: "Invalid user role" });
        }
        res.status(200).json({
            userId: user._id,
            email: user.email,
            role: user.role,
            stats: stats,
        });
    }
    catch (error) {
        console.error("Error fetching user statistics:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
