import { NextFunction, Request, Response } from 'express';

import { logger } from '../logger/logger.config.js';
import { BaseError, UncaughtError } from './custom.errors.js';
import { ErrorCode } from './error.code.enums.js';
import { getOriginalErrorDetails, normalizeError } from './error.services.js';
interface ErrorResponse {
  code: ErrorCode;
  message: string;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const error: BaseError = normalizeError(err);

  const logTitle = `${error.name}: ${error.message}`;
  const logData = {
    code: error.code,
    method: req.method,
    path: req.path,
    stack: error.stack
  };

  if (error instanceof UncaughtError) {
    const originalErrorDetails = getOriginalErrorDetails(error);
    logger.error(logTitle, {
      ...logData,
      originalError: originalErrorDetails
    });
  } else if (error.toLog) {
    logger.error(logTitle, logData);
  } else if (process.env.NODE_ENV === 'development') {
    logger.info(logTitle, logData);
  }

  const response: ErrorResponse = {
    code: error.code,
    message: error.message
  };

  res.status(error.statusCode).json(response);
};
