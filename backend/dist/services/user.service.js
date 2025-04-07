"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(user) {
        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
        const newUser = await this.userRepository.create({
            ...user,
            password: hashedPassword
        });
        return {
            ...newUser,
            password: undefined
        };
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findById(id) {
        return this.userRepository.findById(id);
    }
    async update(id, user) {
        if (user.password) {
            user.password = await bcrypt_1.default.hash(user.password, 10);
        }
        return this.userRepository.update(id, user);
    }
    async delete(id) {
        return this.userRepository.delete(id);
    }
}
exports.UserService = UserService;
