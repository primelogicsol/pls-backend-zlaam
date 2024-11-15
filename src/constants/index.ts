import { ADMIN_MAIL_1, ADMIN_MAIL_2, ENV } from "../config/config";
import type { TCOOKIEOPTIONS } from "../types";
export const COMPANY_NAME = "Prime Logic Solution";
const messages = {
  ERRMSG: "Something went wrong",
  SUCCESSMSG: "Operation was successful",
  NOTFOUNDMSG: "Not Found",
  BADREQUESTMSG: "Bad Request",
  UNAUTHORIZEDMSG: "Unauthorized",
  FORBIDDENMSG: "Forbidden",
  INTERNALSERVERERRORMSG: "Internal Server Error",
  TOOMANYREQUESTSMSG: "Too Many Requests. Please try again after",
  OTPALREADYSENT: "OTP already sent. Please try again after 1 minute"
};
export const {
  ERRMSG,
  SUCCESSMSG,
  NOTFOUNDMSG,
  TOOMANYREQUESTSMSG,
  BADREQUESTMSG,
  UNAUTHORIZEDMSG,
  FORBIDDENMSG,
  INTERNALSERVERERRORMSG,
  OTPALREADYSENT
} = messages;

// CODES
const statusCodes = {
  SUCCESSCODE: 200,
  CREATEDCODE: 201,
  BADREQUESTCODE: 400,
  UNAUTHORIZEDCODE: 401,
  FORBIDDENCODE: 403,
  NOTFOUNDCODE: 404,
  INTERNALSERVERERRORCODE: 500,
  TOOMANYREQUESTSCODE: 429
};
export const {
  SUCCESSCODE,
  TOOMANYREQUESTSCODE,
  CREATEDCODE,
  BADREQUESTCODE,
  UNAUTHORIZEDCODE,
  FORBIDDENCODE,
  NOTFOUNDCODE,
  INTERNALSERVERERRORCODE
} = statusCodes;

const accessTokenExpiry = 14 * 60 * 1000; // 14 minutes in milliseconds
const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const COOKIEOPTIONS = {
  ACESSTOKENCOOKIEOPTIONS: {
    httpOnly: true,
    secure: ENV === "PRODUCTION",
    sameSite: "none",
    expires: new Date(Date.now() + accessTokenExpiry)
  } as TCOOKIEOPTIONS,
  REFRESHTOKENCOOKIEOPTIONS: {
    httpOnly: true,
    secure: ENV === "PRODUCTION",
    sameSite: "none",
    expires: new Date(Date.now() + refreshTokenExpiry)
  } as TCOOKIEOPTIONS
};
export const { REFRESHTOKENCOOKIEOPTIONS, ACESSTOKENCOOKIEOPTIONS } = COOKIEOPTIONS;

export const WHITELISTMAILS = [ADMIN_MAIL_1, ADMIN_MAIL_2];
const QUICKS = {
  CONSULTATIONPENDINGMESSAGEFROMADMIN: `Thank You for your interest in ${COMPANY_NAME}. We have received your request for "free consultation". We are reviewing your request and will get back to you as soon as possible.<p>Best regards,</p> Prime Logic Solution`,
  CONSULTATIONAPPROVALMESSAGEFROMADMIN: `I hope you are doing well, Thank You for your Patience. We are excited to tell you that your request for having a free consultation with us has have been accepted,`,
  CONSULTATIONREJECTMESSAGEFROMADMIN: `We hope this message finds you well. Thank you for your understanding and patience. Unfortunately, after careful consideration, we regret to inform you that we are unable to proceed with scheduling your consultation at this time due to internal circumstances. We truly appreciate your interest and hope to have the opportunity to work with you in the future.<p>Best regards,</p>${COMPANY_NAME}`,
  HIREUSMESSAGE: `Thank you for reaching out to us. We would like to inform you that your request is currently under review. Our team is carefully assessing the details, and we will get back to you as soon as possible with an update.We appreciate your patience and understanding during this process. If you have any additional questions or need further assistance in the meantime, please don’t hesitate to reach out. <p>Best Regards,</p> ${COMPANY_NAME}`,
  THANKYOUMESSAGE: `Thank you for submitting your join request to work with us. We truly appreciate the time and effort you took to reach out, and we’re excited to review your profile. We’ll carefully go through your application and get back to you soon. In the meantime, feel free to share any additional details or ask any questions you may have about the project.Looking forward to connecting further!<p>Best Regard,</p> ${COMPANY_NAME}`,
  ADMINNAME: ` administrator from ${COMPANY_NAME}`
};
export const {
  CONSULTATIONPENDINGMESSAGEFROMADMIN,
  CONSULTATIONAPPROVALMESSAGEFROMADMIN,
  CONSULTATIONREJECTMESSAGEFROMADMIN,
  HIREUSMESSAGE,
  THANKYOUMESSAGE,
  ADMINNAME
} = QUICKS;
const ENDPOINTS = {
  HEALTHROUTE: "/api/v1/health",
  AUTHROUTE: "/api/v1/auth",
  CONTACTUSROUTE: "/api/v1/contactUs",
  NEWSLETTERROUTE: "/api/v1/newsletter",
  TRASHROUTE: "/api/v1/trash",
  NAVIGATIONPAGESROUTE: "/api/v1/navigationPages",
  GETQUOTESROUTE: "/api/v1/getQuotes",
  CONSULTATIONROUTE: "/api/v1/consultation",
  HIREUSROUTE: "/api/v1/hireUs",
  FREELANCER: "/api/v1/freelancer"
};
export const {
  HEALTHROUTE,
  AUTHROUTE,
  CONTACTUSROUTE,
  NEWSLETTERROUTE,
  TRASHROUTE,
  NAVIGATIONPAGESROUTE,
  GETQUOTESROUTE,
  CONSULTATIONROUTE,
  HIREUSROUTE,
  FREELANCER
} = ENDPOINTS;
