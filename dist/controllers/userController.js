"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.getUserInfo = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const authService_1 = require("../services/authService");
exports.getUserInfo = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId } = req.auth;
    res.json({ id: userId });
});
exports.logoutUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { sessionId } = req.auth;
    await (0, authService_1.logout)(sessionId);
    res.status(204).send();
});
