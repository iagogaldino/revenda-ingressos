"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const payment_service_1 = require("../services/payment/payment.service");
const router = (0, express_1.Router)();
const paymentService = new payment_service_1.PaymentService();
const paymentController = new payment_controller_1.PaymentController(paymentService);
// Corrigido: Adicionado NextFunction nos métodos
router.post('/initialize', (req, res, next) => paymentController.initializePayment(req, res, next));
router.post('/webhook/:provider', (req, res, next) => paymentController.handleWebhook(req, res, next));
exports.paymentRoutes = router;
