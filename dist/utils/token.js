"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.hashToken = exports.generateTokenPair = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dayjs_1 = __importDefault(require("dayjs"));
const env_1 = require("../config/env");
const signToken = (payload, secret, expiresInMinutes) => {
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: `${expiresInMinutes}m`,
        jwtid: node_crypto_1.default.randomUUID()
    });
};
const generateTokenPair = (userId, sessionId) => {
    const accessToken = signToken({ sub: userId, sid: sessionId }, env_1.env.jwtAccessSecret, env_1.env.accessTokenTtlMinutes);
    const refreshToken = signToken({ sub: userId, sid: sessionId }, env_1.env.jwtRefreshSecret, env_1.env.refreshTokenTtlMinutes);
    return {
        accessToken,
        refreshToken,
        accessExpiresAt: (0, dayjs_1.default)().add(env_1.env.accessTokenTtlMinutes, 'minute').toDate(),
        refreshExpiresAt: (0, dayjs_1.default)().add(env_1.env.refreshTokenTtlMinutes, 'minute').toDate()
    };
};
exports.generateTokenPair = generateTokenPair;
const hashToken = (token) => node_crypto_1.default.createHash('sha256').update(token).digest('hex');
exports.hashToken = hashToken;
const verifyAccessToken = (token) => jsonwebtoken_1.default.verify(token, env_1.env.jwtAccessSecret);
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => jsonwebtoken_1.default.verify(token, env_1.env.jwtRefreshSecret);
exports.verifyRefreshToken = verifyRefreshToken;
