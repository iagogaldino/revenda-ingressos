"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleRoutes = void 0;
const express_1 = require("express");
const sale_controller_1 = require("../controllers/sale.controller");
const sale_service_1 = require("../services/sale.service");
const sale_repository_1 = require("../repositories/sale.repository");
const router = (0, express_1.Router)();
const saleRepository = new sale_repository_1.SaleRepository();
const saleService = new sale_service_1.SaleService(saleRepository);
const saleController = new sale_controller_1.SaleController(saleService);
// Corrigido: Adicionado NextFunction para que o Express possa tratar erros
router.post('/', (req, res, next) => saleController.createSale(req, res, next));
router.get('/:id/status', (req, res, next) => saleController.getSaleStatus(req, res, next));
exports.saleRoutes = router;
