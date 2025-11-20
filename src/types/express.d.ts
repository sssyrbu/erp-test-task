import type { Session } from '../models/Session';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
        session: Session;
        token: string;
      };
    }
  }
}

export {};

