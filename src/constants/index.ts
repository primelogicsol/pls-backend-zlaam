import { ENV } from "../config/config";
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

  // CODES
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

const ENDPOINTS = {
  HEALTHROUTE: "/api/v1/health",
  AUTHROUTE: "/api/v1/auth"
};
export const { HEALTHROUTE, AUTHROUTE } = ENDPOINTS;
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
