import { Router } from 'express';
import { postRefreshToken, postSignin, postSignup } from '../controllers/authController';

export const authRouter = Router();

authRouter.post('/signup', postSignup);
authRouter.post('/signin', postSignin);
authRouter.post('/signin/new_token', postRefreshToken);

