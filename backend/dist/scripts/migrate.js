"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../config/database");
async function runMigration() {
    try {
        const sql = fs_1.default.readFileSync(path_1.default.join(__dirname, '../migrations/init.sql'), 'utf8');
        await database_1.pool.query(sql);
        console.log('Migration completed successfully');
    }
    catch (error) {
        console.error('Migration failed:', error);
    }
    finally {
        await database_1.pool.end();
    }
}
runMigration();
