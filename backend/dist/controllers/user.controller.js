"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async create(req, res, next) {
        try {
            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async findById(req, res, next) {
        try {
            const user = await this.userService.findById(Number(req.params.id));
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const user = await this.userService.update(Number(req.params.id), req.body);
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await this.userService.delete(Number(req.params.id));
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
