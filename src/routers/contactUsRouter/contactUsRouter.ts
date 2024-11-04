import { Router } from "express";
import contactUsController from "../../controllers/contactUsController/contactUsController";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
import { contactUsSchema } from "../../validation/zod";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";

export const contactUsRouter = Router();

contactUsRouter
  .route("/")
  //TODO: add checkToken middleware
  .post(validateDataMiddleware(contactUsSchema), (req, res, next) => rateLimiterMiddleware(req, res, next, 5), contactUsController.contactUs);
contactUsRouter
  .route("/getAllMessages")
  //TODO: add checkisAdmin middleware
  .get(contactUsController.getAllMessages);

contactUsRouter
  .route("/getSingleMessage/:id")
  //TODO: add checkisAdmin middleware
  .get(contactUsController.getSingleMessage);
contactUsRouter
  .route("/deleteMessage/:id")
  //TODO: add checkisAdmin middleware
  .delete(contactUsController.deleteMessage);
