"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const reviewProducts_1 = __importDefault(require("../models/reviewProducts"));
const product_1 = __importDefault(require("../models/product"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { productId, personId, productDetails } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(productId) ||
            !mongoose_1.default.Types.ObjectId.isValid(personId)) {
            return res.status(400).json({ message: "Invalid productId or personId" });
        }
        const productExists = await product_1.default.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }
        const newReview = new reviewProducts_1.default({
            productId,
            personId,
            productDetails,
        });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    }
    catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.put("/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["pending", "rejected", "approved"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const updatedReview = await reviewProducts_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (status === "approved") {
            await product_1.default.findByIdAndUpdate(updatedReview.productId, {
                $set: updatedReview.productDetails,
            });
        }
        res.status(200).json(updatedReview);
    }
    catch (error) {
        console.error("Error updating review status:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/person/:personId", async (req, res) => {
    try {
        const { personId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(personId)) {
            return res.status(400).json({ message: "Invalid personId" });
        }
        const reviews = await reviewProducts_1.default.find({ personId });
        const groupedReviews = reviews.reduce((acc, review) => {
            if (!acc[review.status]) {
                acc[review.status] = [];
            }
            acc[review.status].push(review);
            return acc;
        }, {});
        const response = {
            approved: groupedReviews.approved || [],
            rejected: groupedReviews.rejected || [],
            pending: groupedReviews.pending || [],
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching reviews by person:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/pending", async (req, res) => {
    try {
        const pendingReviews = await reviewProducts_1.default.find({ status: "pending" });
        res.status(200).json(pendingReviews);
    }
    catch (error) {
        console.error("Error fetching pending reviews:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/product-details/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }
        const review = await reviewProducts_1.default.findById(id).select("productDetails");
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json(review.productDetails);
    }
    catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
