import { NextFunction, Request, Response } from 'express';

function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  console.log(`${req.method} request made to ${req.url}`);
  next(); // Pass control to the next middleware function
}

export default loggerMiddleware;
