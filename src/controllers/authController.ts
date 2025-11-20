import { Request, Response } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler';
import { signin, signup, refreshTokens } from '../services/authService';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const phoneRegex = /^\+?\d{10,15}$/;

const normalizeId = (value: string) => {
  const trimmed = value.trim();
  return emailRegex.test(trimmed) ? trimmed.toLowerCase() : trimmed;
};

const isValidId = (value: string) => emailRegex.test(value) || phoneRegex.test(value);

const credentialsSchema = z.object({
  id: z
    .string()
    .min(3)
    .max(191)
    .transform(normalizeId)
    .refine(isValidId, { message: 'id must be a phone number or email' }),
  password: z.string().min(6)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
});

export const postSignup = asyncHandler(async (req: Request, res: Response) => {
  const body = credentialsSchema.parse(req.body);
  const tokens = await signup(body.id, body.password);
  res.status(201).json(tokens);
});

export const postSignin = asyncHandler(async (req: Request, res: Response) => {
  const body = credentialsSchema.parse(req.body);
  const tokens = await signin(body.id, body.password);
  res.json(tokens);
});

export const postRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const body = refreshSchema.parse(req.body);
  const tokens = await refreshTokens(body.refreshToken);
  res.json(tokens);
});

