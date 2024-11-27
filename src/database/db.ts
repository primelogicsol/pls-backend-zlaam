import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({});
const connectDB = async (): Promise<void> => {
  void (await db.$connect());
};
export { connectDB, db };
