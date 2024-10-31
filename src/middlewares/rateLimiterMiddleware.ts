import type { NextFunction, Request, Response } from "express";
import { ENV } from "../config/config";
import { rateLimiterPrisma } from "../config/rateLimiter";
import { httpResponse } from "../utils/apiResponseUtils";
import { ERRMSG, INTERNALSERVERERRORCODE, TOOMANYREQUESTSCODE, TOOMANYREQUESTSMSG } from "../constants";

export default async (req: Request, res: Response, next: NextFunction, rateLimitPoints?: number, message?: string) => {
  try {
    // TOOD: replace ! with = for production
    if (ENV !== "DEVELOPMENT") return next();
    if (rateLimiterPrisma) {
      await rateLimiterPrisma.consume(req.ip as string, rateLimitPoints || 1);
      next();
    } else {
      throw new Error("Rate limiter not initialized");
    }
  } catch (err: unknown) {
    const error = err as errorLimiter;
    if (error?.remainingPoints === 0) httpResponse(req, res, TOOMANYREQUESTSCODE, message || `${TOOMANYREQUESTSMSG} 1 minute`, null).end();
    else httpResponse(req, res, INTERNALSERVERERRORCODE, `${ERRMSG} with rateLimiter middleware:: ${err as string}$`, null);
  }
};
type errorLimiter = {
  remainingPoints: number;
};
