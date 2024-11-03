import { app } from "./app";
import { PORT } from "./config/config";
import { connectDB } from "./database/db";
import logger from "./utils/loggerUtils";
connectDB()
  .then(() => app.listen(PORT, () => logger.info(`connected to the database successfully ✔️  \n  Listening on port http://localhost:${PORT}`)))
  .catch((err: unknown) => {
    if (err instanceof Error) logger.error(`ERRR while connecting to the database \n ${err.message}`);
    else logger.error(`ERRR while connecting to the database \n ${err as string}`);
    process.exit(1);
  });
