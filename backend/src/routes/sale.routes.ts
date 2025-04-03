
import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { SaleService } from '../services/sale.service';
import { SaleRepository } from '../repositories/sale.repository';

const router = Router();
const saleRepository = new SaleRepository();
const saleService = new SaleService(saleRepository);
const saleController = new SaleController(saleService);

router.post('/', (req, res) => saleController.createSale(req, res));
router.get('/:id/status', (req, res) => saleController.getSaleStatus(req, res));

export const saleRoutes = router;
