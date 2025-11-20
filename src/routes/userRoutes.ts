import { Router } from 'express';
import { getUserInfo, logoutUser } from '../controllers/userController';
import { requireAuth } from '../middleware/authMiddleware';

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get('/info', getUserInfo);
userRouter.get('/logout', logoutUser);

