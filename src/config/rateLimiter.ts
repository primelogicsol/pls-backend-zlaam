import { RateLimiterPrisma } from "rate-limiter-flexible";
import { prisma } from "../database/db";
const POINTS = 10;
const DURATION = 60;
export let rateLimiterPostgres: null | RateLimiterPrisma = null;
export const initRateLimiter = () => {
  rateLimiterPostgres = new RateLimiterPrisma({
    storeClient: prisma,
    points: POINTS,
    duration: DURATION
  });
};
