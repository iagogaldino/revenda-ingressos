"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controllers/auth.controller");
const auth_service_1 = require("../services/auth.service");
const token_service_1 = require("../services/token.service");
const user_repository_1 = require("../repositories/user.repository");
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
const userRepository = new user_repository_1.UserRepository();
const tokenService = new token_service_1.TokenService();
const authService = new auth_service_1.AuthService(userRepository, tokenService);
const authController = new auth_controller_1.AuthController(authService);
// Correção: Adicionar o parâmetro `next: NextFunction`
authRouter.post('/auth/login', (req, res, next) => authController.login(req, res, next));
authRouter.post('/auth/validate-token', (req, res, next) => authController.validateToken(req, res, next));
exports.default = authRouter;
