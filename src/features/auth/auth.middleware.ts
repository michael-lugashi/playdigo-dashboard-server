import { AuthenticationError, UnauthorizedError, UncaughtError } from '#core/errors/custom.errors.js';
import { ExpressHandler, JwtTokenData } from '#interfaces/global.types.js';
import jwt from 'jsonwebtoken';

export const verifyToken: ExpressHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AuthenticationError('Needs Login.');
    }

    const decoded = jwt.verify(token, process.env.JWT_AUTH_TOKEN_SECRET) as JwtTokenData;
    res.locals.tokenData = decoded;
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

export const verifyAdmin: ExpressHandler = (_req, res, next) => {
  const tokenData = res.locals.tokenData;
  if (!tokenData) {
    throw new AuthenticationError('Needs Login.');
  }
  if (tokenData.role !== 'ADMIN') {
    throw new UnauthorizedError({ message: 'Needs Admin Access.', statusCode: 403 });
  }
  next();
};
