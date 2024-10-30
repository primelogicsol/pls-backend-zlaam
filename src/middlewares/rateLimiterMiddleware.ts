import { NextFunction, Request, Response } from "express";
import { ENV } from "../config/config";
import { rateLimiterPostgres } from "../config/rateLimiter";
import { httpResponse } from "../utils/apiResponseUtils";
import { ERRMSG, INTERNALSERVERERRORCODE, TOOMANYREQUESTSCODE, TOOMANYREQUESTSMSG } from "../constants";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (ENV !== "DEVELOPMENT") return next();
    if (rateLimiterPostgres) {
      await rateLimiterPostgres.consume(req.ip as string, 1);
      next();
    } else {
      throw new Error("Rate limiter not initialized");
    }
  } catch (err: unknown) {
    const error = err as errorLimiter;
    if (error?.remainingPoints === 0) httpResponse(req, res, TOOMANYREQUESTSCODE, TOOMANYREQUESTSMSG, null).end();
    else httpResponse(req, res, INTERNALSERVERERRORCODE, `${ERRMSG} with rateLimiter middleware:: ${err as string}$`, null);
  }
};
type errorLimiter = {
  remainingPoints: number;
};
