"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const uploadImage_1 = __importDefault(require("./routes/uploadImage"));
const reviewProducts_1 = __importDefault(require("./routes/reviewProducts"));
const userStats_1 = __importDefault(require("./routes/userStats"));
const app_1 = require("./config/app");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api", productRoute_1.default);
app.use("/api", uploadImage_1.default);
app.use("/api", reviewProducts_1.default);
app.use("/api", userStats_1.default);
mongoose_1.default
    .connect(app_1.APP_CONFIG.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.use("/uploads", express_1.default.static("uploads"));
app.listen(app_1.APP_CONFIG.PORT, () => {
    console.log(`Server is running on port ${app_1.APP_CONFIG.PORT}`);
});
