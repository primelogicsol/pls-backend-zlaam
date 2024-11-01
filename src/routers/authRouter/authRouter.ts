import { Router } from "express";

import authController from "../../controllers/authController/authController";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { sendOTPSchema, userLoginSchema, userRegistrationSchema, verifyUserSchema } from "../../validation/zod";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
import { OTPALREADYSENT } from "../../constants";
export const authRouter = Router();

// Routes**
authRouter.route("/register").post(validateDataMiddleware(userRegistrationSchema), authController.registerUser);

authRouter
  .route("/verifyEmail")
  // 2 req per minute from single  ip adress
  .post(validateDataMiddleware(verifyUserSchema), (req, res, next) => rateLimiterMiddleware(req, res, next, 5), authController.verifyUser);

authRouter
  .route("/sendOTP")
  // 1 req per minute from single  ip adress
  .post(validateDataMiddleware(sendOTPSchema), (req, res, next) => rateLimiterMiddleware(req, res, next, 10, OTPALREADYSENT), authController.sendOTP);

authRouter
  .route("/login")
  // 5 req per mnute from single  ip adress
  .post(validateDataMiddleware(userLoginSchema), (req, res, next) => rateLimiterMiddleware(req, res, next, 2), authController.loginUser);
