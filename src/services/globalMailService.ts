import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { HOST_EMAIL, HOST_EMAIL_SECRET } from "../config/config";
import { generateRandomStrings } from "../utils/slugStringGeneratorUtils";
import logger from "../utils/loggerUtils";
import { replaceAllPlaceholders } from "../utils/replaceAllPlaceholders";
import { COMPANY_NAME, INTERNALSERVERERRORCODE, INTERNALSERVERERRORMSG } from "../constants";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,

  auth: {
    user: HOST_EMAIL,
    pass: HOST_EMAIL_SECRET
  }
});

export async function gloabalMailMessage(
  to: string,
  message?: string | null,
  subject?: string,
  header?: string,
  addsOn?: string,
  senderIntro?: string
) {
  const templatePath = path.resolve(__dirname, "../../templates/globalMessageTemplate.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  const placeholders = {
    companyname: COMPANY_NAME || "Prime Logic Solutions",
    senderIntro: senderIntro || "",
    message: message || "",
    header: header || "",
    addsOn: addsOn || ""
  };
  htmlTemplate = replaceAllPlaceholders(htmlTemplate, placeholders);
  const randomStr = generateRandomStrings(10);
  const mailOptions = {
    from: HOST_EMAIL,
    to: to,
    subject: subject ?? COMPANY_NAME,
    html: htmlTemplate,
    headers: {
      "X-Auto-Response-Suppress": "All",
      Precedence: "bulk",
      "Auto-Submitted": "auto-generated",
      "Message-ID": `<${randomStr}.dev>`
    },

    replyTo: "support@primelogicsole.com"
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email message sent successfully: ${info.response}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error Email message sending :${error.message}`);
      throw { status: INTERNALSERVERERRORCODE, message: INTERNALSERVERERRORMSG };
    }
    logger.error(`Error sending Email  message:${error as string}`);
    throw { status: INTERNALSERVERERRORCODE, message: INTERNALSERVERERRORMSG };
  }
}
