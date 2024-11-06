import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { HOST_EMAIL, HOST_EMAIL_SECRET } from "../config/config";
import { generateRandomStrings } from "./slugStringGeneratorService";
import logger from "../utils/loggerUtils";
import { INTERNALSERVERERRORCODE } from "../constants";

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: HOST_EMAIL,
    pass: HOST_EMAIL_SECRET // Use the app password if 2FA is enabled
  }
});

// Send OTP function
export async function sendThankYouMessage(to: string, name: string) {
  const templatePath = path.resolve(__dirname, "../templates/ThankYou.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  htmlTemplate = htmlTemplate.replace("{{name}}", name);
  const randomStr = generateRandomStrings(10);
  const mailOptions = {
    from: "noreply@pls.com",
    to: to,
    subject: "Thank You For Your Interest",
    html: htmlTemplate,
    headers: {
      "Message-ID": `<${randomStr}.dev>`
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Thank You message  sent successfully: " + info.response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error Thank you message sending :${error.message}`);
      throw { status: INTERNALSERVERERRORCODE, message: "Unable to send thank you message" };
    } else {
      logger.error(`Error sending Thank you message:${error as string}`);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To send thank you message due to server issue" };
    }
  }
}
