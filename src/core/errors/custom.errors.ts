import { ErrorCode } from './error.code.enums.js';
import { ErrorOptions, InternalServerErrorOptions } from './error.types.js';

export class BaseError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly toLog: boolean;

  constructor(options: ErrorOptions | string) {
    // Handle string-only constructor for backward compatibility
    if (typeof options === 'string') {
      options = { message: options };
    }

    const {
      code = ErrorCode.INTERNAL_SERVER_ERROR,
      message = 'Internal Server Error',
      statusCode = 500,
      toLog = statusCode >= 500 // Log 500+ errors by default
    } = options;

    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.toLog = toLog;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.UNAUTHORIZED,
      statusCode: 401,
      toLog: false,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class AuthenticationError extends UnauthorizedError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.AUTHENTICATION_FAILED,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class BadRequestError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.BAD_REQUEST,
      statusCode: 400,
      toLog: false,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class ConflictError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.CONFLICT,
      statusCode: 409,
      toLog: false,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class DatabaseError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.DATABASE_ERROR,
      statusCode: 500,
      toLog: true,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
      toLog: false,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class UncaughtError extends BaseError {
  private readonly originalError: unknown;

  constructor(error: unknown) {
    super({
      code: ErrorCode.UNCAUGHT_ERROR,
      message: 'Internal Server Error',
      statusCode: 500,
      toLog: true
    });

    this.originalError = error;

    if (error instanceof Error) {
      this.stack = error.stack;
    }
  }

  public getOriginalError(): unknown {
    return this.originalError;
  }
}
export class GoogleSheetsUncaughtError extends UncaughtError {}
export class InternalServerError extends BaseError {
  public readonly logMessage: string;

  constructor(options: InternalServerErrorOptions | string) {
    const parsedOptions = typeof options === 'string' ? { logMessage: options } : options;
    const { logMessage = 'Internal Server Error', ...restOptions } = parsedOptions;

    super({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error', // Client-facing message
      statusCode: 500,
      toLog: true,
      ...restOptions
    });

    // Store logMessage separately for logging
    this.logMessage = logMessage;
  }
}

export class ValidationError extends BadRequestError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.INVALID_INPUT,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class MissingParameterError extends ValidationError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.MISSING_PARAMETER,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.NOT_FOUND,
      statusCode: 404,
      toLog: false,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}
export class RateLimitError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      statusCode: 429,
      toLog: false,
      ...(typeof options === 'string' ? { message: options } : options)
    });
  }
}
