"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const category_router_1 = __importDefault(require("./modules/categories/category.router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// ROUTES //
app.use("/api/categories", category_router_1.default);
app.get("/", (req, res) => {
    res.send("API is running...");
});
db_1.default
    .sync({ alter: true })
    .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
    });
})
    .catch((error) => {
    console.log("Database connection error:", error);
});
