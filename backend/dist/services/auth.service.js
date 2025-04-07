"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    userRepository;
    tokenService;
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    async login(credentials) {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new Error('User not found');
        }
        const isValidPassword = await bcrypt_1.default.compare(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }
        const token = this.tokenService.generateToken({ userId: user.id });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        };
    }
    async validateToken(token) {
        try {
            this.tokenService.verifyToken(token);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.AuthService = AuthService;
