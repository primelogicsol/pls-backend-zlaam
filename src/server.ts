import express from "express";
import type { Express } from "express";
import { PORT } from "./config/config";
const app: Express = express();
const port = PORT;
app.get("/", (_, res) => {
  res.send("Hello World!!!");
});
app.listen(port, () => console.log(`listening on port ${port}`));
