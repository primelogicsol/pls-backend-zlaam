import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandlerUtils";
import { verifyToken } from "../services/verifyTokenService";
import { FORBIDDENCODE, FORBIDDENMSG, UNAUTHORIZEDCODE, UNAUTHORIZEDMSG } from "../constants";
import type { TPAYLOAD } from "../types";
import { db } from "../database/db";
import logger from "../utils/loggerUtils";

export type _Request = Request & {
  userFromToken?: TPAYLOAD;
};
export default {
  checkToken: asyncHandler(async (req: _Request, _: Response, next: NextFunction) => {
    const accessToken = req.header("Authorization");
    if (!accessToken) {
      logger.error("No access token found", "authMiddleware.ts:13");
      throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    }
    const parsedToken = accessToken?.split(" ")[1] || "";
    if (!parsedToken) {
      logger.error(
        `Invalid access token. It seems Bearer is not attached with the Token or maybe check the spelling of Bearer`,
        parsedToken,
        "authMiddleware.ts:18"
      );
      throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    }
    const [error, decoded] = verifyToken<TPAYLOAD>(parsedToken);
    if (error) {
      logger.error("Error while verifying token", "authMiddleware.ts:24");
      throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    }
    if (!decoded?.uid) {
      logger.warn("Invalid token. Not uid found in accessToken", "authMiddleware.ts:28");
      throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    }
    const user = await db.user.findUnique({ where: { uid: decoded.uid } });
    if (user?.tokenVersion !== decoded.tokenVersion) {
      logger.error("Invalid token. tokenVersion doesn't match maybe session is expired", "authMiddleware.ts:33");
      throw { status: UNAUTHORIZEDCODE, message: "Session expired. Please login again" };
    }
    if (decoded.isVerified == null) {
      logger.error("user is not verified", "authMiddleware.ts:36");
      throw { status: FORBIDDENCODE, message: FORBIDDENMSG };
    }

    req.userFromToken = decoded;

    return next();
  }),
  checkIfUserIsAdmin: (req: _Request, _: Response, next: NextFunction) => {
    if (req.userFromToken?.role !== "ADMIN") {
      logger.info("Since User is not Admin He/She can't perform this operation", "authMiddleware.ts:48");

      throw { status: FORBIDDENCODE, message: FORBIDDENMSG };
    }
    return next();
  },
  checkIfUserIAdminOrModerator: (req: _Request, _: Response, next: NextFunction) => {
    if (req.userFromToken?.role !== "ADMIN" && req.userFromToken?.role !== "MODERATOR") {
      logger.info("Checking if user is admin or moderator", "authMiddleware.ts:53");
      throw { status: FORBIDDENCODE, message: FORBIDDENMSG };
    }
    return next();
  }
};
