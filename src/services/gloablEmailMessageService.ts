import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { HOST_EMAIL, HOST_EMAIL_SECRET } from "../config/config";
import { generateRandomStrings } from "./slugStringGeneratorService";
import logger from "../utils/loggerUtils";
import { INTERNALSERVERERRORCODE } from "../constants";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: HOST_EMAIL,
    pass: HOST_EMAIL_SECRET
  }
});

export async function gloabalEmailMessage(
  from: string,
  to: string,
  name: string,
  message?: string | null,
  subject?: string,
  head?: string,
  addsOn?: string
) {
  const templatePath = path.resolve(__dirname, "../templates/globalEmailMessageTemplate.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  htmlTemplate = htmlTemplate
    .replace("{{name}}", name)
    .replace("{{message}}", message || "")
    .replace("{{head}}", head || "")
    .replace("{{addsOn}}", addsOn || "");
  const randomStr = generateRandomStrings(10);
  const mailOptions = {
    from: from ?? "noreply@pls.com",
    to: to,
    subject: subject ?? "Prime Logic Solution",
    html: htmlTemplate,
    headers: {
      "Message-ID": `<${randomStr}.dev>`
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(" Consultation message sent successfully: " + info.response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error constulation message sending :${error.message}`);
      throw { status: INTERNALSERVERERRORCODE, message: "Unable to send constulation  message" };
    } else {
      logger.error(`Error sending constulation  message:${error as string}`);

      throw { status: INTERNALSERVERERRORCODE, message: "Unable To send constulation you message due to server issue" };
    }
  }
}
