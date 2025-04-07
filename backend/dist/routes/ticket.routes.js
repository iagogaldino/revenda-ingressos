"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRoutes = void 0;
const express_1 = require("express");
const ticket_controller_1 = require("../controllers/ticket.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const ticket_service_1 = require("../services/ticket.service");
const ticket_repository_1 = require("../repositories/ticket.repository");
const router = (0, express_1.Router)();
const ticketService = new ticket_service_1.TicketService(new ticket_repository_1.TicketRepository());
const ticketController = new ticket_controller_1.TicketController(ticketService);
// Configuração do multer
const uploadMiddleware = (0, multer_1.default)().fields([{ name: 'image' }, { name: 'file' }]);
// Rotas de Tickets protegidas por autenticação
router.post('/seller/tickets', auth_middleware_1.authenticateToken, uploadMiddleware, (req, res, next) => ticketController.create(req, res, next));
router.put('/seller/tickets/:id', auth_middleware_1.authenticateToken, uploadMiddleware, (req, res, next) => ticketController.update(req, res, next));
router.delete('/tickets/:id', auth_middleware_1.authenticateToken, (req, res, next) => ticketController.deleteTicket(req, res, next));
// Rotas públicas
router.get('/tickets', (req, res, next) => ticketController.getAllTickets(req, res, next));
router.get('/tickets/:id', (req, res, next) => ticketController.getTicketById(req, res, next));
router.get('/tickets/download/:id', auth_middleware_1.authenticateToken, (req, res, next) => ticketController.downloadTicket(req, res, next));
// Rota protegida por autenticação (Busca ingressos do usuário autenticado)
router.get('/seller/tickets', auth_middleware_1.authenticateToken, (req, res, next) => ticketController.getTicketsBySeller(req, res, next));
router.get('/tickets/seller/:sellerId', (req, res, next) => ticketController.getTicketsBySellerId(req, res, next));
exports.ticketRoutes = router;
