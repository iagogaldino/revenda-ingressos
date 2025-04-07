"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.Router)();
const categoryController = new category_controller_1.CategoryController();
router.get('/categories', (req, res, next) => categoryController.getCategories(req, res, next));
exports.categoryRoutes = router;
