import { PrismaClient } from "@prisma/client";
import { initRateLimiter } from "../config/rateLimiter";
import logger from "../utils/loggerUtils";

const db = new PrismaClient({});

const connectDB = async (): Promise<void> => {
  void (await db
    .$connect()
    .then(() => {
      initRateLimiter();
    })
    .catch((err: unknown) => {
      if (err instanceof Error) logger.error(`ERRR while connecting to the database \n ${err.message}`);
      else logger.error(`ERRR while connecting to the database \n ${err as string}`);
      process.exit(1);
    }));
};
export { connectDB, db };
