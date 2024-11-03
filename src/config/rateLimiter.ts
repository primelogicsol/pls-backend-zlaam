import { RateLimiterPrisma } from "rate-limiter-flexible";
import { db } from "../database/db";
import { DURATION, POINTS } from "../constants";
export let rateLimiterPrisma: null | RateLimiterPrisma = null;
export const initRateLimiter = () => {
  rateLimiterPrisma = new RateLimiterPrisma({
    storeClient: db,
    points: POINTS,
    duration: DURATION
  });
};
