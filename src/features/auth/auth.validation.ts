import { createParseBodyMiddleware, handleValidationError } from '#core/validation/validation.services.js';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password must be less than 16 characters long')
});

export type AuthSchema = z.infer<typeof authSchema>;

export const validateAuth = createParseBodyMiddleware(authSchema, handleValidationError);
