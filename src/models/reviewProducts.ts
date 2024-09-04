// models/review.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
  status: "pending" | "rejected" | "approved";
  productDetails: {
    productName: string;
    price: number;
    image: string;
    productDescription: string;
    department: string;
    id: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    personId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
    },
    productDetails: {
      productName: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      productDescription: { type: String, required: true },
      department: { type: String, required: true },
      id: { type: String, required: true, unique: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", ReviewSchema);
