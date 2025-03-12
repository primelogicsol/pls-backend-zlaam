import express, { type Express } from "express";

import cors from "cors";
import path from "node:path";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";
import helmet from "helmet";
import { ALLOWED_ORIGIN } from "./config/config";
import { BASEURL } from "./constants/endpoint";
import { defaultRouter } from "./routers/defaultRouter";
// **** APP *****
const app: Express = express();
// ** MIDDLEWARES **

app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
    origin: ALLOWED_ORIGIN
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ parameterLimit: 50000, extended: true }));
app.use(express.static(path.resolve(__dirname, "./public")));
// **APPLICATION ROUTES **
app.use(BASEURL, defaultRouter);

// **** ERROR HANDLERS ****
app.use(notFoundHandler);
app.use(errorHandler);
export { app };
