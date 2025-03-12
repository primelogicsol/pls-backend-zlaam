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
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  WHITE_LIST_MAILS: process.env.WHITE_LIST_MAILS as string,
  ALLOWED_ORIGIN: JSON.parse(process.env.ALLOWED_ORIGIN as string) as string[]
};
export const {
  PORT,
  ENV,
  JWT_SECRET,
  HOST_EMAIL,
  HOST_EMAIL_SECRET,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  WHITE_LIST_MAILS,
  ALLOWED_ORIGIN
} = config;
