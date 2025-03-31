import { ErrorCode } from './error.code.enums.js';

interface ErrorOptions {
  code?: ErrorCode;
  message?: string;
  statusCode?: number;
  toLog?: boolean;
}

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
      toLog = statusCode < 500 // Log 500+ errors by default
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
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.UNAUTHORIZED,
      statusCode: 401,
      toLog: false
    });
  }
}

export class AuthenticationError extends UnauthorizedError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.AUTHENTICATION_FAILED
    });
  }
}

export class BadRequestError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.BAD_REQUEST,
      statusCode: 400,
      toLog: false
    });
  }
}

export class ConflictError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.CONFLICT,
      statusCode: 409,
      toLog: false
    });
  }
}

export class DatabaseError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.DATABASE_ERROR,
      statusCode: 500,
      toLog: true
    });
  }
}

export class ExternalServiceError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      statusCode: 500,
      toLog: true
    });
  }
}

export class ForbiddenError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.FORBIDDEN,
      statusCode: 403,
      toLog: false
    });
  }
}

export class ValidationError extends BadRequestError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.INVALID_INPUT
    });
  }
}

export class FormatError extends ValidationError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.INVALID_FORMAT
    });
  }
}

export class GoogleSheetsError extends ExternalServiceError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.GOOGLE_SHEETS_ERROR
    });
  }
}

export class MissingParameterError extends ValidationError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.MISSING_PARAMETER
    });
  }
}

export class NotFoundError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.NOT_FOUND,
      statusCode: 404,
      toLog: false
    });
  }
}

export class RateLimitError extends BaseError {
  constructor(options: ErrorOptions | string) {
    super({
      ...(typeof options === 'string' ? { message: options } : options),
      code: ErrorCode.RATE_LIMIT_EXCEEDED,
      statusCode: 429,
      toLog: false
    });
  }
}

export class UncaughtError extends BaseError {
  private readonly originalError: unknown;

  constructor(error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';

    super({
      code: ErrorCode.UNCAUGHT_ERROR,
      message,
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
