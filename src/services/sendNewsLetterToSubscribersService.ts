import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { HOST_EMAIL, HOST_EMAIL_SECRET } from "../config/config";
import { generateRandomStrings } from "./slugStringGeneratorService";
import logger from "../utils/loggerUtils";
import { INTERNALSERVERERRORCODE } from "../constants";

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,

  auth: {
    user: HOST_EMAIL,
    pass: HOST_EMAIL_SECRET
  }
});

export async function sendNewsLetterToSubscribers(to: string, newsLetterFromAdmin: string) {
  const templatePath = path.resolve(__dirname, "../templates/sendNewsLetter.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  htmlTemplate = htmlTemplate.replace("{{newsLetterFromAdmin}}", newsLetterFromAdmin);
  const randomStr = generateRandomStrings(10);
  const mailOptions = {
    from: "noreply@pls.com",
    to: to,
    subject: "News Letter For You By Prime Logic Solution",
    html: htmlTemplate,
    headers: {
      "Message-ID": `<${randomStr}.dev>`
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("newLetter sent: " + info.response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("newsLetter  sending error:", error.message);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To recieve message" };
    } else {
      logger.error("newsLetter sending message:", +`${error as string}`);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To recieve message" };
    }
  }
}
