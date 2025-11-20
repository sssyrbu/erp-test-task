import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { logout } from '../services/authService';

export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.auth!;
  res.json({ id: userId });
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.auth!;
  await logout(sessionId);
  res.status(204).send();
});

