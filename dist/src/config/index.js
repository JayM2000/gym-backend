"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const serverless_1 = require("@neondatabase/serverless");
const neon_serverless_1 = require("drizzle-orm/neon-serverless");
const ws_1 = __importDefault(require("ws")); // Required in Node
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const pool = new serverless_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
exports.db = (0, neon_serverless_1.drizzle)(pool);
