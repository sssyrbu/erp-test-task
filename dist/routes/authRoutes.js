"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/signup', authController_1.postSignup);
exports.authRouter.post('/signin', authController_1.postSignin);
exports.authRouter.post('/signin/new_token', authController_1.postRefreshToken);
