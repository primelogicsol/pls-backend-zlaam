import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

const connectDB = async (): Promise<void> => {
  void (await prisma
    .$connect()
    .then(() => console.log(`Connected to the database successfully ✔️`))
    .catch((err: unknown) => {
      if (err instanceof Error) console.log(`ERRR while connecting to the database \n ${err.message}`);
      else console.log(`ERRR while connecting to the database \n ${err as string}`);
      process.exit(1);
    }));
};
export { connectDB, prisma };
