"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRefreshToken = exports.postSignin = exports.postSignup = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const authService_1 = require("../services/authService");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const phoneRegex = /^\+?\d{10,15}$/;
const normalizeId = (value) => {
    const trimmed = value.trim();
    return emailRegex.test(trimmed) ? trimmed.toLowerCase() : trimmed;
};
const isValidId = (value) => emailRegex.test(value) || phoneRegex.test(value);
const credentialsSchema = zod_1.z.object({
    id: zod_1.z
        .string()
        .min(3)
        .max(191)
        .transform(normalizeId)
        .refine(isValidId, { message: 'id must be a phone number or email' }),
    password: zod_1.z.string().min(6)
});
const refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10)
});
exports.postSignup = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = credentialsSchema.parse(req.body);
    const tokens = await (0, authService_1.signup)(body.id, body.password);
    res.status(201).json(tokens);
});
exports.postSignin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = credentialsSchema.parse(req.body);
    const tokens = await (0, authService_1.signin)(body.id, body.password);
    res.json(tokens);
});
exports.postRefreshToken = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const body = refreshSchema.parse(req.body);
    const tokens = await (0, authService_1.refreshTokens)(body.refreshToken);
    res.json(tokens);
});
