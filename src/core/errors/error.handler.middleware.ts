import { logger } from '../logger/logger.config.js';
import { BaseError, InternalServerError, UncaughtError } from './custom.errors.js';
import { getOriginalErrorDetails, normalizeError } from './error.services.js';
import { ErrorHandlerMiddleware, ErrorResponse } from './error.types.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorHandlerMiddleware = (err, req, res, _next): void => {
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
  } else if (error instanceof InternalServerError) {
    logger.error(logTitle, {
      ...logData,
      message: error.logMessage
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

export default errorHandler;
