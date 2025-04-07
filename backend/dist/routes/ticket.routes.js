"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ticket_controller_1 = require("../controllers/ticket.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const ticketController = new ticket_controller_1.TicketController();
const uploadMiddleware = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Tipo de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }
}).fields([{ name: 'image' }, { name: 'file' }]);
const handleUpload = (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};
router.post('/seller/tickets', auth_middleware_1.authenticateToken, handleUpload, (req, res, next) => ticketController.create(req, res, next));
router.put('/seller/tickets/:id', auth_middleware_1.authenticateToken, handleUpload, (req, res, next) => ticketController.update(req, res, next));
router.delete('/tickets/:id', auth_middleware_1.authenticateToken, (req, res, next) => ticketController.deleteTicket(req, res, next));
router.get('/tickets', (req, res, next) => ticketController.getAllTickets(req, res, next));
router.get('/tickets/:id', (req, res, next) => ticketController.getTicketById(req, res, next));
router.get('/tickets/download/:id', auth_middleware_1.authenticateToken, (req, res, next) => ticketController.downloadTicket(req, res, next));
router.get('/seller/tickets', auth_middleware_1.authenticateToken, (req, res, next) => ticketController.getTicketsBySeller(req, res, next));
router.get('/tickets/seller/:sellerId', (req, res, next) => ticketController.getTicketsBySellerId(req, res, next));
exports.ticketRoutes = router;
