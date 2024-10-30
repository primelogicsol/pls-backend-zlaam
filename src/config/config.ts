import process from "node:process";
import DotenvFlow from "dotenv-flow";
import { envType } from "../types";
DotenvFlow.config();

const config = {
  ENV: process.env.ENV as envType,
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET as string
};
export const { PORT, ENV, JWT_SECRET } = config;
