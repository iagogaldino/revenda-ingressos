"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async create(req, res) {
        try {
            const user = await this.userService.create(req.body);
            return res.status(201).json(user);
        }
        catch (error) {
            console.log(error);
            if (error.message === 'Email already registered') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async findById(req, res) {
        try {
            const user = await this.userService.findById(Number(req.params.id));
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async update(req, res) {
        try {
            const user = await this.userService.update(Number(req.params.id), req.body);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async delete(req, res) {
        try {
            await this.userService.delete(Number(req.params.id));
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.UserController = UserController;
