"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = __importDefault(require("../models/product"));
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
// Fetch and store products
router.get("/fetch-products", async (req, res) => {
    try {
        const response = await axios_1.default.get("https://64e0caef50713530432cafa1.mockapi.io/api/products");
        const products = response.data;
        const savedProducts = await product_1.default.insertMany(products);
        res
            .status(200)
            .json({ message: "Products stored successfully", data: savedProducts });
    }
    catch (error) {
        console.error("Error fetching or storing products:", error);
        res.status(500).json({
            message: "Error fetching or storing products",
            error: error.message,
        });
    }
});
// Get all products
router.get("/products", async (req, res) => {
    try {
        const products = await product_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Error fetching products",
            error: error.message,
        });
    }
});
router.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const products = await product_1.default.find({ id });
        res.status(200).json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: "Error fetching products",
            error: error.message,
        });
    }
});
// Update a product by ID
router.put("/products/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedProduct = await product_1.default.findOneAndUpdate({ id }, updateData, {
            new: true,
        });
        if (updatedProduct) {
            res.status(200).json({
                message: "Product updated successfully",
                data: updatedProduct,
            });
        }
        else {
            res.status(404).json({ message: "Product not found" });
        }
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            message: "Error updating product",
            error: error.message,
        });
    }
});
exports.default = router;
