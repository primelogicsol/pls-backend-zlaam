import express from "express";
import type { Express } from "express";
const app: Express = express();
app.get("/", (_, res) => {
  res.send("Hello World ");
});
app.listen(3000, () => console.log("listening on port 3000"));
