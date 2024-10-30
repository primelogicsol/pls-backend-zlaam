import { RateLimiterPrisma } from "rate-limiter-flexible";
import { db } from "../database/db";
const POINTS = 10;
const DURATION = 60;
export let rateLimiterPrisma: null | RateLimiterPrisma = null;
export const initRateLimiter = () => {
  rateLimiterPrisma = new RateLimiterPrisma({
    storeClient: db,
    points: POINTS,
    duration: DURATION
  });
};
