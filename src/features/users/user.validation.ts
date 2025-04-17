import {
  createParseBodyMiddleware,
  createParseParamsMiddleware,
  handleValidationError
} from '#core/validation/validation.services.js';
import { z } from 'zod';

// Schema for updateUserController

const updateUserBodySchema = z
  .object({
    email: z.string().email().optional(),
    firstName: z.string().min(3).max(20).optional(),
    graphAccess: z.array(z.string()).optional(),
    institutionName: z.string().min(1).max(20).optional(),
    lastName: z.string().min(3).max(20).optional(),
    role: z.enum(['ADMIN', 'USER']).optional()
  })
  .strict()
  .refine(
    (data) => {
      // Ensure at least one field is provided
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update'
    }
  );

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

const createUserBodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(3).max(20),
  graphAccess: z.array(z.string()).min(1),
  institutionName: z.string().min(1).max(20),
  lastName: z.string().min(3).max(20),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'USER'])
});

export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

export const validateCreateUser = createParseBodyMiddleware(createUserBodySchema, handleValidationError);
