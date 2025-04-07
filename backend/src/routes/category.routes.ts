
import { Router, Request, Response, NextFunction } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();
const categoryController = new CategoryController();

router.get('/categories', (req: Request, res: Response, next: NextFunction) => 
  categoryController.getCategories(req, res, next)
);

export const categoryRoutes = router;
