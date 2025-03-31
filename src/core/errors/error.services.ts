import { BaseError, UncaughtError } from './custom.errors.js';

type UncaughtOriginalErrorDetails =
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

export const getOriginalErrorDetails = (error: UncaughtError): UncaughtOriginalErrorDetails => {
  const originalError = error.getOriginalError();

  // Format the original error details based on its type
  let originalErrorDetails: UncaughtOriginalErrorDetails;

  if (originalError instanceof Error) {
    originalErrorDetails = {
      message: originalError.message,
      name: originalError.name,
      stack: originalError.stack
    };
  } else if (typeof originalError === 'object' && originalError !== null) {
    try {
      originalErrorDetails = JSON.stringify(originalError);
    } catch {
      originalErrorDetails = Object.prototype.toString.call(originalError);
    }
  } else {
    // For primitive values (string, number, boolean, etc.)
    originalErrorDetails = originalError as UncaughtOriginalErrorDetails;
  }

  return originalErrorDetails;
};

export const normalizeError = (err: unknown): BaseError => {
  // If the error is not an instance of BaseError, wrap it in UncaughtError
  if (!(err instanceof BaseError)) {
    return new UncaughtError(err);
  } else {
    return err;
  }
};
