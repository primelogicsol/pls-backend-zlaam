import express, { type Express } from "express";

import cors from "cors";
import path from "node:path";
import { authRouter } from "./routers/authRouter/authRouter";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";
import { AUTHROUTE, CONTACTUSROUTE, HEALTHROUTE } from "./constants/index";
import { healthRouter } from "./routers/healthRouter/healthRouter";
import helmet from "helmet";
import { contactUsRouter } from "./routers/contactUsRouter/contactUsRouter";
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
    origin: "*" // change this in production
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../", "public")));
// **APPLICATION ROUTES **
app.use(AUTHROUTE, authRouter);
// ** Health route
app.use(HEALTHROUTE, healthRouter);
// ** Contact Us Route
app.use(CONTACTUSROUTE, contactUsRouter);
// **** ERROR HANDLERS ****
app.use(notFoundHandler);
app.use(errorHandler);
export { app };
