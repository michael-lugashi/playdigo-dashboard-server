import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export const createMiddleware = (schema: z.ZodSchema, errorHandlingFn: (err: ZodError) => void): ExpressHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      next();
    } else {
      errorHandlingFn(result.error);
    }
  };
};
