import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { env } from '../config/env';

interface TokenPayload {
  sub: string;
  sid: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
}

const signToken = (payload: TokenPayload, secret: string, expiresInMinutes: number) => {
  return jwt.sign(payload, secret, {
    expiresIn: `${expiresInMinutes}m`,
    jwtid: crypto.randomUUID()
  });
};

export const generateTokenPair = (userId: string, sessionId: string): TokenPair => {
  const accessToken = signToken({ sub: userId, sid: sessionId }, env.jwtAccessSecret, env.accessTokenTtlMinutes);
  const refreshToken = signToken({ sub: userId, sid: sessionId }, env.jwtRefreshSecret, env.refreshTokenTtlMinutes);

  return {
    accessToken,
    refreshToken,
    accessExpiresAt: dayjs().add(env.accessTokenTtlMinutes, 'minute').toDate(),
    refreshExpiresAt: dayjs().add(env.refreshTokenTtlMinutes, 'minute').toDate()
  };
};

export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const verifyAccessToken = (token: string) => jwt.verify(token, env.jwtAccessSecret) as jwt.JwtPayload;

export const verifyRefreshToken = (token: string) => jwt.verify(token, env.jwtRefreshSecret) as jwt.JwtPayload;

