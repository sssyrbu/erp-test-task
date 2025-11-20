"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrThrow = exports.logout = exports.refreshTokens = exports.signin = exports.signup = void 0;
const node_crypto_1 = require("node:crypto");
const dayjs_1 = __importDefault(require("dayjs"));
const HttpError_1 = require("../errors/HttpError");
const Session_1 = require("../models/Session");
const User_1 = require("../models/User");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const buildAuthResponse = (tokens) => ({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    accessExpiresAt: tokens.accessExpiresAt,
    refreshExpiresAt: tokens.refreshExpiresAt
});
const persistSession = async (userId) => {
    const sessionId = (0, node_crypto_1.randomUUID)();
    const tokens = (0, token_1.generateTokenPair)(userId, sessionId);
    await Session_1.Session.create({
        id: sessionId,
        userId,
        accessTokenHash: (0, token_1.hashToken)(tokens.accessToken),
        refreshTokenHash: (0, token_1.hashToken)(tokens.refreshToken),
        accessExpiresAt: tokens.accessExpiresAt,
        refreshExpiresAt: tokens.refreshExpiresAt,
        revokedAt: null
    });
    return tokens;
};
const signup = async (id, password) => {
    if (!id || !password) {
        throw new HttpError_1.BadRequestError('id and password are required');
    }
    const existingUser = await User_1.User.findByPk(id);
    if (existingUser) {
        throw new HttpError_1.ConflictError('User already exists');
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    await User_1.User.create({ id, passwordHash });
    const tokens = await persistSession(id);
    return buildAuthResponse(tokens);
};
exports.signup = signup;
const signin = async (id, password) => {
    if (!id || !password) {
        throw new HttpError_1.BadRequestError('id and password are required');
    }
    const user = await User_1.User.findByPk(id);
    if (!user) {
        throw new HttpError_1.UnauthorizedError('Invalid credentials');
    }
    const matches = await (0, password_1.verifyPassword)(password, user.passwordHash);
    if (!matches) {
        throw new HttpError_1.UnauthorizedError('Invalid credentials');
    }
    const tokens = await persistSession(user.id);
    return buildAuthResponse(tokens);
};
exports.signin = signin;
const refreshTokens = async (refreshToken) => {
    if (!refreshToken) {
        throw new HttpError_1.BadRequestError('Refresh token is required');
    }
    const payload = (0, token_1.verifyRefreshToken)(refreshToken);
    const sessionId = payload.sid;
    const userId = payload.sub;
    if (!sessionId || !userId) {
        throw new HttpError_1.UnauthorizedError('Invalid refresh token');
    }
    const session = await Session_1.Session.findByPk(sessionId);
    if (!session) {
        throw new HttpError_1.UnauthorizedError('Session not found');
    }
    if (session.revokedAt) {
        throw new HttpError_1.UnauthorizedError('Session revoked');
    }
    if ((0, dayjs_1.default)(session.refreshExpiresAt).isBefore((0, dayjs_1.default)())) {
        throw new HttpError_1.UnauthorizedError('Refresh token expired');
    }
    const incomingHash = (0, token_1.hashToken)(refreshToken);
    if (incomingHash !== session.refreshTokenHash) {
        throw new HttpError_1.UnauthorizedError('Refresh token mismatch');
    }
    const user = await User_1.User.findByPk(userId);
    if (!user) {
        throw new HttpError_1.UnauthorizedError('User no longer exists');
    }
    const tokens = (0, token_1.generateTokenPair)(userId, session.id);
    await session.update({
        accessTokenHash: (0, token_1.hashToken)(tokens.accessToken),
        refreshTokenHash: (0, token_1.hashToken)(tokens.refreshToken),
        accessExpiresAt: tokens.accessExpiresAt,
        refreshExpiresAt: tokens.refreshExpiresAt
    });
    return buildAuthResponse(tokens);
};
exports.refreshTokens = refreshTokens;
const logout = async (sessionId) => {
    const session = await Session_1.Session.findByPk(sessionId);
    if (!session) {
        return;
    }
    await session.update({ revokedAt: new Date() });
};
exports.logout = logout;
const getUserOrThrow = async (id) => {
    const user = await User_1.User.findByPk(id);
    if (!user) {
        throw new HttpError_1.NotFoundError('User not found');
    }
    return user;
};
exports.getUserOrThrow = getUserOrThrow;
