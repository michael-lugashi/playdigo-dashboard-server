import { FormatError, MissingParameterError, ValidationError } from '#core/errors/custom.errors.js';
import { ErrorCode } from '#core/errors/error.code.enums.js';
import { createMiddleware } from '#core/validation/validation.services.js';
import { z, ZodError } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be less than 16 characters long')
});

export type AuthSchema = z.infer<typeof authSchema>;

/**
 * Formats Zod validation errors into readable messages and throws appropriate error types
 */
export const validateAuth = createMiddleware(authSchema, (zodError: ZodError) => {
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
});
