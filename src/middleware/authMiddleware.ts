import { NextFunction, Request, Response } from 'express';
import dayjs from 'dayjs';
import { UnauthorizedError } from '../errors/HttpError';
import { Session } from '../models/Session';
import { hashToken, verifyAccessToken } from '../utils/token';

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing bearer token');
  }

  const token = authHeader.substring('Bearer '.length).trim();

  if (!token) {
    throw new UnauthorizedError('Invalid bearer token');
  }

  const payload = verifyAccessToken(token);
  const sessionId = payload.sid as string;
  const userId = payload.sub as string;

  if (!sessionId || !userId) {
    throw new UnauthorizedError('Invalid token payload');
  }

  const session = await Session.findByPk(sessionId);

  if (!session) {
    throw new UnauthorizedError('Session not found');
  }

  if (session.revokedAt) {
    throw new UnauthorizedError('Session revoked');
  }

  if (dayjs(session.accessExpiresAt).isBefore(dayjs())) {
    throw new UnauthorizedError('Token expired');
  }

  const incomingHash = hashToken(token);

  if (incomingHash !== session.accessTokenHash) {
    throw new UnauthorizedError('Token mismatch');
  }

  req.auth = {
    userId,
    sessionId,
    session,
    token
  };

  next();
};

