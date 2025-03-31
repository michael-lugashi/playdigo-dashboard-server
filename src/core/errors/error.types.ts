import { ErrorCode } from './error.code.enums.js';

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
  stack?: string;
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
