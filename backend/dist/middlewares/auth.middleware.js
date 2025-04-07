"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    console.log('authenticateToken');
    const token = req.headers['authorization']?.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || '';
    if (!JWT_SECRET) {
        throw Error('process.env.JWT_SECRET null');
    }
    if (!token) {
        return res.status(401).json({ success: false, error: 'Token não encontrado' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.tokenDecoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        next();
    }
    catch (err) {
        return res.status(403).json({ success: false, error: 'Token inválido' });
    }
};
exports.authenticateToken = authenticateToken;
