import { Router, Request, Response, NextFunction } from 'express';

import { SaleController } from '../controllers/sale.controller';
import { SaleService } from '../services/sale.service';
import { SaleRepository } from '../repositories/sale.repository';

const router = Router();
const saleRepository = new SaleRepository();
const saleService = new SaleService(saleRepository);
const saleController = new SaleController(saleService);

// Corrigido: Adicionado NextFunction para que o Express possa tratar erros
router.post('/', (req: Request, res: Response, next: NextFunction) => saleController.createSale(req, res, next));
router.get('/:id/status', (req: Request, res: Response, next: NextFunction) => saleController.getSaleStatus(req, res, next));

export const saleRoutes = router;
