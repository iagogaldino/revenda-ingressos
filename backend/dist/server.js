"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ticket_routes_1 = require("./routes/ticket.routes");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const payment_routes_1 = require("./routes/payment.routes");
const sale_routes_1 = require("./routes/sale.routes");
const category_routes_1 = require("./routes/category.routes");
const youtube_routes_1 = require("./routes/youtube.routes"); // Added import for YouTube routes
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: true,
    credentials: true
}));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
// Routes
app.use('/api', ticket_routes_1.ticketRoutes);
app.use('/api', user_routes_1.default);
app.use('/api', auth_routes_1.default);
app.use('/api', category_routes_1.categoryRoutes);
app.use('/api/payments', payment_routes_1.paymentRoutes);
app.use('/api/sales', sale_routes_1.saleRoutes);
app.use('/api', youtube_routes_1.youtubeRoutes); // Registered YouTube routes
// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
