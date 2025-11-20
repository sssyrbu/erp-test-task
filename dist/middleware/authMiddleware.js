"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const HttpError_1 = require("../errors/HttpError");
const Session_1 = require("../models/Session");
const token_1 = require("../utils/token");
const requireAuth = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw new HttpError_1.UnauthorizedError('Missing bearer token');
    }
    const token = authHeader.substring('Bearer '.length).trim();
    if (!token) {
        throw new HttpError_1.UnauthorizedError('Invalid bearer token');
    }
    const payload = (0, token_1.verifyAccessToken)(token);
    const sessionId = payload.sid;
    const userId = payload.sub;
    if (!sessionId || !userId) {
        throw new HttpError_1.UnauthorizedError('Invalid token payload');
    }
    const session = await Session_1.Session.findByPk(sessionId);
    if (!session) {
        throw new HttpError_1.UnauthorizedError('Session not found');
    }
    if (session.revokedAt) {
        throw new HttpError_1.UnauthorizedError('Session revoked');
    }
    if ((0, dayjs_1.default)(session.accessExpiresAt).isBefore((0, dayjs_1.default)())) {
        throw new HttpError_1.UnauthorizedError('Token expired');
    }
    const incomingHash = (0, token_1.hashToken)(token);
    if (incomingHash !== session.accessTokenHash) {
        throw new HttpError_1.UnauthorizedError('Token mismatch');
    }
    req.auth = {
        userId,
        sessionId,
        session,
        token
    };
    next();
};
exports.requireAuth = requireAuth;
