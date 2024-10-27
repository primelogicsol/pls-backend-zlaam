import { type NextFunction, type Request, type Response } from "express";

// eslint-disable-next-line no-unused-vars
const asyncHandler = (requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void | undefined | Response>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };
