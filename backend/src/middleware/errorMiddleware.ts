import { Request, NextFunction, Response } from 'express';
import { ErrorResponse } from '../util/customErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (err: Error | ErrorResponse, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err instanceof ErrorResponse ? err.statusCode : 500;
  const message = err instanceof ErrorResponse ? err.message : 'Internal Server Error';

  console.error(`Error ${message}, Status Code: ${statusCode}, Path: ${req.path}, err`);

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
export default errorMiddleware;
