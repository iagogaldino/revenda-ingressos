"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const user_service_1 = require("../services/user.service");
const user_repository_1 = require("../repositories/user.repository");
const usersRouters = (0, express_1.Router)();
const userRepository = new user_repository_1.UserRepository();
const userService = new user_service_1.UserService(userRepository);
const userController = new user_controller_1.UserController(userService);
// Adicionando o NextFunction para tratamento de erros corretamente
usersRouters.post('/users', (req, res, next) => userController.create(req, res, next));
usersRouters.get('/users/:id', (req, res, next) => userController.findById(req, res, next));
usersRouters.put('/users/:id', (req, res, next) => userController.update(req, res, next));
usersRouters.delete('/users/:id', (req, res, next) => userController.delete(req, res, next));
exports.default = usersRouters;
