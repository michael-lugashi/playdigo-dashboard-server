import { createParseQueryMiddleware, handleValidationError } from '#core/validation/validation.services.js';
import { z } from 'zod';

// Schema for getDashboardDataController
const dashboardDataSchema = z.object({
  sheetName: z.string().min(1, 'Sheet name must not be empty')
});

// Schema for getDashboardDataAdminController
const dashboardDataAdminSchema = z.object({
  sheetName: z.string().min(1, 'Sheet name must not be empty'),
  userId: z.string().min(1, 'User ID must not be empty')
});

export type DashboardDataAdminSchema = z.infer<typeof dashboardDataAdminSchema>;
export type DashboardDataSchema = z.infer<typeof dashboardDataSchema>;

export const validateDashboardData = createParseQueryMiddleware(dashboardDataSchema, handleValidationError);
export const validateDashboardDataAdmin = createParseQueryMiddleware(dashboardDataAdminSchema, handleValidationError);
