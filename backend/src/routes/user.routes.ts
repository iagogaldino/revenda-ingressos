import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';

const usersRouters = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Adicionando o NextFunction para tratamento de erros corretamente
usersRouters.post('/users', (req: Request, res: Response, next: NextFunction) => userController.create(req, res, next));
usersRouters.get('/users/:id', (req: Request, res: Response, next: NextFunction) => userController.findById(req, res, next));
usersRouters.put('/users/:id', (req: Request, res: Response, next: NextFunction) => userController.update(req, res, next));
usersRouters.delete('/users/:id', (req: Request, res: Response, next: NextFunction) => userController.delete(req, res, next));

export default usersRouters;
