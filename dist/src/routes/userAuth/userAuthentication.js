"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("../../config");
const usersSchema_1 = require("../../models/usersSchema");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
// secret key for JWT — keep this in env variables
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
app.post("/register", express_1.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, surname, mobile, email, imageUrl, password } = req.body;
    try {
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and name field!",
                status: 400,
            });
        }
        // Check if user already exists
        const existing = yield config_1.db
            .select()
            .from(usersSchema_1.userDetails)
            .where((0, drizzle_orm_1.eq)(usersSchema_1.userDetails.email, email))
            .limit(1);
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
                status: 409,
            });
        }
        // Hash password
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const dbRes = yield config_1.db
            .insert(usersSchema_1.userDetails)
            .values({
            email,
            name,
            password: hashed,
            surname: surname !== null && surname !== void 0 ? surname : null,
            phoneNumber: mobile !== null && mobile !== void 0 ? mobile : null,
            imageUrl: imageUrl !== null && imageUrl !== void 0 ? imageUrl : null,
        })
            .returning();
        const newUser = dbRes === null || dbRes === void 0 ? void 0 : dbRes[0];
        console.log(newUser, "llloo");
        if (!(newUser === null || newUser === void 0 ? void 0 : newUser.id)) {
            res.status(400).json({
                success: false,
                message: "Something went wrong while registering",
                status: 400,
            });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: newUser === null || newUser === void 0 ? void 0 : newUser.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(201).json({
            success: true,
            message: "User registered",
            token,
            status: 201,
        });
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).json({
            success: false,
            message: "Failed to register. Please try again later",
        });
    }
}));
app.post("/login", express_1.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const isUserExist = yield config_1.db
            .select()
            .from(usersSchema_1.userDetails)
            .where((0, drizzle_orm_1.eq)(usersSchema_1.userDetails.email, email))
            .limit(1);
        if (isUserExist.length < 1) {
            res.status(404).json({
                success: false,
                message: "User not found!",
                status: 404,
            });
        }
        const user = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist[0];
        const valid = yield bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                status: 401,
            });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            status: 200,
        });
    }
    catch (err) {
        console.error("Error verifying webhook:", err);
        return res.status(400).json({
            success: false,
            message: "Failed to login. Please try again later",
            status: 400
        });
    }
}));
exports.default = app;
