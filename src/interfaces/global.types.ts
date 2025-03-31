import { NextFunction, Request, Response } from 'express';

export type ExpressHandler<TBody = unknown, TQuery = unknown, TParams = unknown, TResBody = unknown> = (
  req: Request<TParams, TResBody, TBody, TQuery>,
  res: Response<TResBody>,
  next: NextFunction
) => Promise<void> | void;
