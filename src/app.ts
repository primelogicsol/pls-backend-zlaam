import express, { type Express } from "express";

import cors from "cors";
import path from "node:path";
import { authRouter } from "./routers/authRouter/authRouter";
// **** APP *****
const app: Express = express();
// ** MIDDLEWARES **
app.use(express.json());
app.use(express.static(path.join(__dirname, "../", "public")));
app.use(cors());
// ** ROUTES **
app.use("/api/v1", authRouter);
export { app };
