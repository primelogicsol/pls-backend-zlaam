import process from "node:process";
import DotenvFlow from "dotenv-flow";
import { envType } from "../types";
DotenvFlow.config();

const config = {
  ENV: process.env.ENV as envType,
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRY: process.env.JWT_EXPIRY as string
};
export const { PORT, ENV } = config;
