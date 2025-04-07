
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { UserRepository } from '../repositories/user.repository';
import { pool } from '../config/database';

const authRouter = Router();

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);
const authController = new AuthController(authService);

authRouter.post('/auth/login', (req: Request, res: Response) => authController.login(req, res));
authRouter.post('/auth/validate-token', (req: Request, res: Response) => authController.validateToken(req, res));

export default authRouter;
