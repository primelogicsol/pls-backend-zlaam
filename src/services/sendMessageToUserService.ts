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

export async function sendMessageToTheUserService(to: string, messageByAdmin: string, name: string) {
  const templatePath = path.resolve(__dirname, "../templates/sendMessageToUser.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  htmlTemplate = htmlTemplate.replace("{{messageByAdmin}}", messageByAdmin).replace("{{name}}", name);
  const randomStr = generateRandomStrings(10);
  const mailOptions = {
    from: "noreply@pls.com",
    to: to,
    subject: "Replied Mail by Administrator of Prime Logic Solution",
    html: htmlTemplate,
    headers: {
      "Message-ID": `<${randomStr}.dev>`
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("message sent: " + info.response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("message  sending error:", error.message);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To send message" };
    } else {
      logger.error("message sending message:", +`${error as string}`);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To send message" };
    }
  }
}
