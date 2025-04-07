import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { UserRepository } from '../repositories/user.repository';
import { Router, Request, Response, NextFunction } from 'express';

const authRouter = Router();

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);
const authController = new AuthController(authService);

// Correção: Adicionar o parâmetro `next: NextFunction`
authRouter.post('/auth/login', (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next));
authRouter.post('/auth/validate-token', (req: Request, res: Response, next: NextFunction) => authController.validateToken(req, res, next));

export default authRouter;
