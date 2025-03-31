import { AuthenticationError, UncaughtError } from '#core/errors/custom.errors.js';
import { ExpressHandler } from '#interfaces/global.types.js';
import jwt from 'jsonwebtoken';

export const verifyToken: ExpressHandler = (req, _res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AuthenticationError('Needs Login.');
    }

    jwt.verify(token, process.env.JWT_AUTH_TOKEN_SECRET);
    next();
  } catch (err: unknown) {
    if (!(err instanceof Error)) {
      throw new UncaughtError(err);
    }

    switch (err.name) {
      case 'JsonWebTokenError':
        throw new AuthenticationError('Invalid Bearer Token. Needs Login.');
      case 'TokenExpiredError': {
        throw new AuthenticationError('Session Expired. Needs Login.');
      }
      default:
        throw err;
    }
  }
};
