import { NextFunction, Request, Response } from 'express';

export type ExpressHandler<TBody = unknown, TQuery = unknown, TParams = unknown, TResBody = unknown> = (
  req: Request<TParams, TResBody, TBody, TQuery>,
  res: Response<TResBody, { tokenData?: JwtTokenData }>,
  next: NextFunction
) => Promise<void> | void;

export type ExpressHandlerWithToken<TBody = unknown, TQuery = unknown, TParams = unknown, TResBody = unknown> = (
  req: Request<TParams, TResBody, TBody, TQuery>,
  res: Response<TResBody, { tokenData: JwtTokenData }>,
  next: NextFunction
) => Promise<void> | void;

export interface JwtTokenData {
  institutionServiceName: string;
  role: string;
  userId: string;
}
