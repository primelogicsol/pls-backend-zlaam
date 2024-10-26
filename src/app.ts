import express, { type Express } from "express";
import cors from "cors";
// **** EXPORTS *****
const app: Express = express();
app.use(cors());
export { app };
