import { ADMIN_MAIL_1, ADMIN_MAIL_2, ENV } from "../config/config";
import type { TCOOKIEOPTIONS } from "../types";
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

const rateLimitingPoints = {
  POINTS: 10,
  DURATION: 60
};
export const { POINTS, DURATION } = rateLimitingPoints;

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

const ENDPOINTS = {
  HEALTHROUTE: "/api/v1/health",
  AUTHROUTE: "/api/v1/auth",
  CONTACTUSROUTE: "/api/v1/contactUs",
  NEWSLETTERROUTE: "/api/v1/newsletter"
};
export const { HEALTHROUTE, AUTHROUTE, CONTACTUSROUTE, NEWSLETTERROUTE } = ENDPOINTS;
