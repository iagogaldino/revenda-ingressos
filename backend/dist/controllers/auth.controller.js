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
            const { email, password } = req.body;
            const result = await this.authService.login({ email, password });
            res.json(result);
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async validateToken(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const isValid = await this.authService.validateToken(token);
            if (!isValid) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.json({ valid: true });
        }
        catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}
exports.AuthController = AuthController;
