import { app } from "./app";
import { PORT } from "./config/config";
import { connectDB } from "./database/db";
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
  .catch((err: unknown) => {
    if (err instanceof Error) console.info(`ERRR while connecting to the database \n ${err.message}`);
    else console.info(`ERRR while connecting to the database \n ${err as string}`);
    process.exit(1);
  });
