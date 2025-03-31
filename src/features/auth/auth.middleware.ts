import { ExpressHandler } from '#interfaces/global.types.js';
import jwt from 'jsonwebtoken';

export const verifyToken: ExpressHandler = (req, _res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Needs Login.');
    }

    jwt.verify(token, process.env.JWT_AUTH_TOKEN_SECRET);
    next();
  } catch (err) {
    if (!(err instanceof Error)) {
      throw new Error(String(err));
    }

    switch (err.name) {
      case 'JsonWebTokenError':
        throw new Error('Invalid Bearer Token. Needs Login.');
      case 'TokenExpiredError': {
        throw new Error('Session Expired. Needs Login.');
      }
      default:
        throw err;
    }
  }
};
