"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res, next) {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async validateToken(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(401).json({ message: 'No token provided' });
                return;
            }
            const isValid = await this.authService.validateToken(token);
            if (!isValid) {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }
            res.json({ valid: true });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
