
import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();
const categoryController = new CategoryController();

router.get('/categories', (req, res) => categoryController.getCategories(req, res));

export const categoryRoutes = router;
