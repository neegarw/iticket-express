"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const yamljs_1 = __importDefault(require("yamljs"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket/socket");
const category_router_1 = __importDefault(require("./routes/category.router"));
const venue_router_1 = __importDefault(require("./routes/venue.router"));
const event_router_1 = __importDefault(require("./routes/event.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const admin_router_1 = __importDefault(require("./routes/admin.router"));
const seating_router_1 = __importDefault(require("./routes/seating.router"));
const ticket_router_1 = __importDefault(require("./routes/ticket.router"));
const promocode_router_1 = __importDefault(require("./routes/promocode.router"));
const order_router_1 = __importDefault(require("./routes/order.router"));
const payment_router_1 = __importDefault(require("./routes/payment.router"));
const seat_router_1 = __importDefault(require("./routes/seat.router"));
const eventseat_router_1 = __importDefault(require("./routes/eventseat.router"));
const support_router_1 = __importDefault(require("./routes/support.router"));
const permission_seeder_1 = require("./seeders/permission.seeder");
require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.get("/test-auth", (_req, res) => {
    res.render("auth", { googleClientId: process.env.GOOGLE_CLIENT_ID });
});
app.get("/test-support", (_req, res) => {
    res.render("support", { googleClientId: process.env.GOOGLE_CLIENT_ID });
});
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
app.use("/api/categories", category_router_1.default);
app.use("/api/venues", venue_router_1.default);
app.use("/api/events", event_router_1.default);
app.use("/api/auth", auth_router_1.default);
app.use("/api/users", user_router_1.default);
app.use("/api/admin", admin_router_1.default);
app.use("/api/seatings", seating_router_1.default);
app.use("/api/tickets", ticket_router_1.default);
app.use("/api/seats", seat_router_1.default);
app.use("/api/event-seats", eventseat_router_1.default);
app.use("/api/promocodes", promocode_router_1.default);
app.use("/api/orders", order_router_1.default);
app.use("/api/payments", payment_router_1.default);
app.use("/api/support", support_router_1.default);
app.get("/", (_req, res) => res.send("API is running..."));
const PORT = Number(process.env.PORT) || 3000;
async function setupSwagger() {
    try {
        const swaggerDocument = (await swagger_parser_1.default.bundle(path_1.default.join(__dirname, "docs", "swagger.yaml")));
        const pathsDir = path_1.default.join(__dirname, "docs", "paths");
        const pathFiles = fs_1.default
            .readdirSync(pathsDir)
            .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"));
        let mergedPaths = { ...swaggerDocument.paths };
        for (const file of pathFiles) {
            const loaded = yamljs_1.default.load(path_1.default.join(pathsDir, file));
            mergedPaths = { ...mergedPaths, ...loaded };
        }
        swaggerDocument.paths = mergedPaths;
        const schemasDir = path_1.default.join(__dirname, "docs", "schemas");
        const schemaFiles = fs_1.default
            .readdirSync(schemasDir)
            .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"));
        let mergedSchemas = { ...swaggerDocument.components?.schemas };
        for (const file of schemaFiles) {
            const loaded = yamljs_1.default.load(path_1.default.join(schemasDir, file));
            if (loaded && typeof loaded === "object" && !loaded.type) {
                mergedSchemas = { ...mergedSchemas, ...loaded };
            }
            else {
                const name = path_1.default.basename(file, path_1.default.extname(file));
                const schemaName = name.charAt(0).toUpperCase() + name.slice(1);
                mergedSchemas[schemaName] = loaded;
            }
        }
        swaggerDocument.components = {
            ...swaggerDocument.components,
            schemas: mergedSchemas,
        };
        app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
        console.log("✅ Swagger docs loaded at /api-docs");
    }
    catch (error) {
        console.error("❌ Swagger bundling error:", error);
    }
}
async function bootstrap() {
    await setupSwagger();
    app.use((_req, res) => {
        res.status(404).json({ success: false, message: "Route not found" });
    });
    server.listen(PORT, "0.0.0.0", async () => {
        console.log(`🚀 Server running on port ${PORT}`);
        try {
            await db_1.default.authenticate();
            console.log("✅ Database connected");
            await db_1.default.sync();
            console.log("✅ Models synced");
            await (0, permission_seeder_1.seedPermissions)();
        }
        catch (error) {
            console.error("❌ Database connection error:", error);
            process.exit(1);
        }
    });
}
bootstrap();
