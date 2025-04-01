
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';

const usersRouters = Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

usersRouters.post('/users', (req, res) => userController.create(req, res));
usersRouters.get('/users/:id', (req, res) => userController.findById(req, res));
usersRouters.put('/users/:id', (req, res) => userController.update(req, res));
usersRouters.delete('/users/:id', (req, res) => userController.delete(req, res));

export default usersRouters;
