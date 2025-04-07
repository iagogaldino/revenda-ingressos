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
// Configuração do Multer para upload de arquivos
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
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).fields([{ name: 'image' }, { name: 'file' }]); // Aceitar imagem e arquivo PDF
// Rotas de Tickets protegidas por autenticação
router.post('/seller/tickets', auth_middleware_1.authenticateToken, uploadMiddleware, (req, res) => ticketController.create(req, res));
router.put('/seller/tickets/:id', auth_middleware_1.authenticateToken, uploadMiddleware, (req, res) => ticketController.update(req, res));
router.delete('/tickets/:id', auth_middleware_1.authenticateToken, (req, res) => ticketController.deleteTicket(req, res));
// Rotas públicas
router.get('/tickets', (req, res) => ticketController.getAllTickets(req, res));
router.get('/tickets/:id', (req, res) => ticketController.getTicketById(req, res));
router.get('/tickets/download/:id', auth_middleware_1.authenticateToken, (req, res) => ticketController.downloadTicket(req, res));
// Rota protegida por autenticação (Busca ingressos do usuário autenticado)
router.get('/seller/tickets', auth_middleware_1.authenticateToken, ticketController.getTicketsBySeller.bind(ticketController));
router.get('/tickets/seller/:sellerId', (req, res) => ticketController.getTicketsBySellerId(req, res));
exports.ticketRoutes = router;
