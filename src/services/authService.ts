import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors/HttpError';
import { Session } from '../models/Session';
import { User } from '../models/User';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateTokenPair, hashToken, verifyRefreshToken } from '../utils/token';

const buildAuthResponse = (tokens: { accessToken: string; refreshToken: string; accessExpiresAt: Date; refreshExpiresAt: Date }) => ({
  accessToken: tokens.accessToken,
  refreshToken: tokens.refreshToken,
  accessExpiresAt: tokens.accessExpiresAt,
  refreshExpiresAt: tokens.refreshExpiresAt
});

const persistSession = async (userId: string) => {
  const sessionId = randomUUID();
  const tokens = generateTokenPair(userId, sessionId);

  await Session.create({
    id: sessionId,
    userId,
    accessTokenHash: hashToken(tokens.accessToken),
    refreshTokenHash: hashToken(tokens.refreshToken),
    accessExpiresAt: tokens.accessExpiresAt,
    refreshExpiresAt: tokens.refreshExpiresAt,
    revokedAt: null
  });

  return tokens;
};

export const signup = async (id: string, password: string) => {
  if (!id || !password) {
    throw new BadRequestError('id and password are required');
  }

  const existingUser = await User.findByPk(id);

  if (existingUser) {
    throw new ConflictError('User already exists');
  }

  const passwordHash = await hashPassword(password);
  await User.create({ id, passwordHash });

  const tokens = await persistSession(id);

  return buildAuthResponse(tokens);
};

export const signin = async (id: string, password: string) => {
  if (!id || !password) {
    throw new BadRequestError('id and password are required');
  }

  const user = await User.findByPk(id);

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const matches = await verifyPassword(password, user.passwordHash);

  if (!matches) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const tokens = await persistSession(user.id);
  return buildAuthResponse(tokens);
};

export const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new BadRequestError('Refresh token is required');
  }

  const payload = verifyRefreshToken(refreshToken);
  const sessionId = payload.sid as string;
  const userId = payload.sub as string;

  if (!sessionId || !userId) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  const session = await Session.findByPk(sessionId);

  if (!session) {
    throw new UnauthorizedError('Session not found');
  }

  if (session.revokedAt) {
    throw new UnauthorizedError('Session revoked');
  }

  if (dayjs(session.refreshExpiresAt).isBefore(dayjs())) {
    throw new UnauthorizedError('Refresh token expired');
  }

  const incomingHash = hashToken(refreshToken);

  if (incomingHash !== session.refreshTokenHash) {
    throw new UnauthorizedError('Refresh token mismatch');
  }

  const user = await User.findByPk(userId);

  if (!user) {
    throw new UnauthorizedError('User no longer exists');
  }

  const tokens = generateTokenPair(userId, session.id);

  await session.update({
    accessTokenHash: hashToken(tokens.accessToken),
    refreshTokenHash: hashToken(tokens.refreshToken),
    accessExpiresAt: tokens.accessExpiresAt,
    refreshExpiresAt: tokens.refreshExpiresAt
  });

  return buildAuthResponse(tokens);
};

export const logout = async (sessionId: string) => {
  const session = await Session.findByPk(sessionId);

  if (!session) {
    return;
  }

  await session.update({ revokedAt: new Date() });
};

export const getUserOrThrow = async (id: string) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

