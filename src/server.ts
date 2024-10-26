import express from "express";
import process from "node:process";
import type { Express } from "express";
const app: Express = express();
const port = process?.env?.PORT || 4000;
app.get("/", (req, res) => {
  res.send("Hello World!!");
});
app.listen(port, () => console.log(`listening on port ${port}`));
