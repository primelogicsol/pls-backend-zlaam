import { app } from "./app";
import { PORT } from "./config/config";
import { connectDB } from "./database/db";
connectDB()
  .then(() =>
    app.listen(Number(PORT), "0.0.0.0", () =>
      console.log(`connected to the database successfully ✔️  \n  Listening on port http://localhost:${PORT}`)
    )
  )
  .catch((err: unknown) => {
    if (err instanceof Error) console.error(`ERRR while connecting to the database \n ${err.message}`);
    else console.error(`ERRR while connecting to the database \n ${err as string}`);
    process.exit(1);
  });
