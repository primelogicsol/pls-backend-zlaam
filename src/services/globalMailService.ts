import nodemailer from "nodemailer";
import { ENV, HOST_EMAIL, HOST_EMAIL_SECRET } from "../config/config";
import { COMPANY_NAME, INTERNALSERVERERRORCODE, INTERNALSERVERERRORMSG } from "../constants";
import logger from "../utils/loggerUtils";
import { generateRandomStrings } from "../utils/slugStringGeneratorUtils";

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
  //if env is development then return
  if (ENV == "DEVELOPMENT") return;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { font-size: 12px; color: #666; text-align: center; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${header || ""}</h2>
        </div>
        <div class="content">
          <p>${senderIntro || ""}</p>
          <p>${message || ""}</p>
          <p>${addsOn || ""}</p>
        </div>
        <div class="footer">
          <p>${COMPANY_NAME || "Prime Logic Solutions"}</p>
        </div>
      </div>
    </body>
    </html>
  `;

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
    logger.error(`Error sending Email message:${error as string}`);
    throw { status: INTERNALSERVERERRORCODE, message: INTERNALSERVERERRORMSG };
  }
}
