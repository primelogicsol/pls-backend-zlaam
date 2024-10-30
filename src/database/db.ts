import { PrismaClient } from "@prisma/client";
import { initRateLimiter } from "../config/rateLimiter";

const db = new PrismaClient({});

const connectDB = async (): Promise<void> => {
  void (await db
    .$connect()
    .then(() => {
      console.info(`Connected to the database successfully ✔️`);
      initRateLimiter();
    })
    .catch((err: unknown) => {
      if (err instanceof Error) console.log(`ERRR while connecting to the database \n ${err.message}`);
      else console.info(`ERRR while connecting to the database \n ${err as string}`);
      process.exit(1);
    }));
};
export { connectDB, db };
