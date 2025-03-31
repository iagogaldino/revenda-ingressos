"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mockData_1 = require("./data/mockData");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
// Get tickets with filters
app.get('/api/tickets', (req, res) => {
    const { category, minPrice, maxPrice } = req.query;
    let filteredTickets = [...mockData_1.mockTickets];
    if (category) {
        filteredTickets = filteredTickets.filter(ticket => ticket.category.toLowerCase() === category.toLowerCase());
    }
    if (minPrice) {
        filteredTickets = filteredTickets.filter(ticket => ticket.price >= Number(minPrice));
    }
    if (maxPrice) {
        filteredTickets = filteredTickets.filter(ticket => ticket.price <= Number(maxPrice));
    }
    res.json(filteredTickets);
});
// Get categories
app.get('/api/categories', (req, res) => {
    res.json(mockData_1.categories);
});
app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
