import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Review, { IReview } from "../models/reviewProducts";
import Product from "../models/product";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { productId, personId, productDetails } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(personId)
    ) {
      return res.status(400).json({ message: "Invalid productId or personId" });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newReview = new Review({
      productId,
      personId,
      productDetails,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "rejected", "approved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (status === "approved") {
      await Product.findByIdAndUpdate(updatedReview.productId, {
        $set: updatedReview.productDetails,
      });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/person/:personId", async (req: Request, res: Response) => {
  try {
    const { personId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(personId)) {
      return res.status(400).json({ message: "Invalid personId" });
    }

    const reviews = await Review.find({ personId });

    const groupedReviews = reviews.reduce((acc, review) => {
      if (!acc[review.status]) {
        acc[review.status] = [];
      }
      acc[review.status].push(review);
      return acc;
    }, {} as Record<string, IReview[]>);

    const response = {
      approved: groupedReviews.approved || [],
      rejected: groupedReviews.rejected || [],
      pending: groupedReviews.pending || [],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching reviews by person:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pending", async (req: Request, res: Response) => {
  try {
    const pendingReviews = await Review.find({ status: "pending" });
    res.status(200).json(pendingReviews);
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/product-details/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(id).select("productDetails");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review.productDetails);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
