import { NextFunction, Request, Response } from 'express';

import { ErrorCode } from './error.code.enums.js';

/**
 * Middleware function type for handling errors in Express applications
 */
export type ErrorHandlerMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => void;

/**
 * Options for creating error instances
 */
export interface ErrorOptions {
  code?: ErrorCode;
  message?: string;
  statusCode?: number;
  toLog?: boolean;
}

/**
 * Standard error response format for API responses
 */
export interface ErrorResponse {
  code: ErrorCode;
  message: string;
}

export interface InternalServerErrorOptions extends ErrorOptions {
  logMessage: string;
}

export interface UncaughtErrorOptions extends ErrorOptions {
  originalError: unknown;
}

/**
 * Types of original error details that can be extracted from UncaughtError
 */
export type UncaughtOriginalErrorDetails =
  | boolean
  | null
  | number
  | string
  | undefined
  | {
      message: string;
      name: string;
      stack?: string;
    };
