import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { HOST_EMAIL, HOST_EMAIL_SECRET } from "../config/config";
import { generateRandomStrings } from "./slugStringGeneratorService";
import logger from "../utils/loggerUtils";

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: HOST_EMAIL,
    pass: HOST_EMAIL_SECRET // Use the app password if 2FA is enabled
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
    if (error instanceof Error) logger.error("newsLetter  sending error:", error.message);
    else logger.error("newsLetter sending message:", +`${error as string}`);
  }
}
