import process from "node:process";
import DotenvFlow from "dotenv-flow";
import type { TENV } from "../types";
DotenvFlow.config();

const config = {
  ENV: process.env.ENV as TENV,
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET as string,
  HOST_EMAIL: process.env.SMTP_HOST_EMAIL as string,
  HOST_EMAIL_SECRET: process.env.SMTP_SECRET as string,
  ADMIN_MAIL_1: process.env.ADMIN_EMAIL1 as string,
  ADMIN_MAIL_2: process.env.ADMIN_EMAIL2 as string
};
export const { PORT, ENV, JWT_SECRET, HOST_EMAIL, HOST_EMAIL_SECRET, ADMIN_MAIL_1, ADMIN_MAIL_2 } = config;
