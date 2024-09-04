import { Router } from "express";
import Product from "../models/product";
import axios from "axios";

const router = Router();

// Fetch and store products
router.get("/fetch-products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://64e0caef50713530432cafa1.mockapi.io/api/products"
    );
    const products = response.data;
    const savedProducts = await Product.insertMany(products);

    res
      .status(200)
      .json({ message: "Products stored successfully", data: savedProducts });
  } catch (error) {
    console.error("Error fetching or storing products:", error);
    res.status(500).json({
      message: "Error fetching or storing products",
      error: (error as Error).message,
    });
  }
});

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: (error as Error).message,
    });
  }
});

router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.find({ id });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: (error as Error).message,
    });
  }
});

// Update a product by ID
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate({ id }, updateData, {
      new: true,
    });
    if (updatedProduct) {
      res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: (error as Error).message,
    });
  }
});

export default router;
