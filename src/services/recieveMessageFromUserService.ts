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

export async function recieveMessageFromUser(from: string, to: string, messageByUser: string, name: string) {
  const templatePath = path.resolve(__dirname, "../templates/recieveMessageFromUser.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  htmlTemplate = htmlTemplate.replace("{{messageByUser}}", messageByUser).replace("{{name}}", name).replace("{{mail}}", from);
  const randomStr = generateRandomStrings(10);
  const mailOptions = {
    from: from,
    to: to,
    subject: "Interested in working with Prime Logic Solution",
    html: htmlTemplate,
    headers: {
      "Message-ID": `<${randomStr}.dev>`
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info("Message  recieveMessageFromUser: " + info.response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("message  recieving error:", error.message);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To recieve message" };
    } else {
      logger.error("message sending message:", +`${error as string}`);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To recieve message" };
    }
  }
}
