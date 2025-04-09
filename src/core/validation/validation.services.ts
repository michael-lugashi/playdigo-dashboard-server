import { ValidationError } from '#core/errors/custom.errors.js';
import { MissingParameterError } from '#core/errors/custom.errors.js';
import { ExpressHandler } from '#interfaces/global.types.js';
import { z, ZodError } from 'zod';


export const createParseBodyMiddleware = (
  schema: z.ZodSchema,
  errorHandlingFn: (err: ZodError) => void
): ExpressHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      next();
    } else {
      errorHandlingFn(result.error);
    }
  };
};

export const createParseQueryMiddleware = (
  schema: z.ZodSchema,
  errorHandlingFn: (err: ZodError) => void
): ExpressHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (result.success) {
      next();
    } else {
      errorHandlingFn(result.error);
    }
  };
};

export const handleValidationError = (zodError: ZodError) => {
  // Extract formatted error messages
  const formattedErrors = zodError.errors.map((err) => {
    const field = err.path.join('.');
    return `${field}: ${err.message}`;
  });

  // Determine the error type
  const errorMessage = formattedErrors.join(', ');

  // Check if any errors are about missing fields
  const hasMissingField = zodError.errors.some((err) => err.code === 'invalid_type' && err.received === 'undefined');

  if (hasMissingField) {
    throw new MissingParameterError(errorMessage);
  }

  // Default to generic validation error
  throw new ValidationError(errorMessage);
};
