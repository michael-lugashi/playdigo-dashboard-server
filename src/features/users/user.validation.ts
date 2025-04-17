import { USER_KEYS } from '#core/google.sheets/google.sheets.types.js';
import {
  createParseBodyMiddleware,
  createParseParamsMiddleware,
  handleValidationError
} from '#core/validation/validation.services.js';
import { z } from 'zod';

// Schema for updateUserController

const updateUserBodySchema = z.object({
  key: z.enum(USER_KEYS),
  value: z.string()
});

const updateUserParamsSchema = z.object({
  userId: z.string()
});

export type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;

export type UpdateUserParamsSchema = z.infer<typeof updateUserParamsSchema>;

export const validateUpdateUser = [
  createParseParamsMiddleware(updateUserParamsSchema, handleValidationError),
  createParseBodyMiddleware(updateUserBodySchema, handleValidationError)
];

// Schema for updateUserController
