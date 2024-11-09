import { Router } from "express";
import getQuoteController from "../../controllers/getQuoteController/getQuoteController";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { getQuoteSchema } from "../../validation/zod";
import authMiddleware from "../../middlewares/authMiddleware";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";

export const getQuoteRouter = Router();

getQuoteRouter.route("/createQuote").post(
  validateDataMiddleware(getQuoteSchema),
  // 1 quote per minute from same ip address
  (req, res, next) => rateLimiterMiddleware(req, res, next, 10),
  getQuoteController.createQuote
);
getQuoteRouter.route("/createServicesForQuote").post(getQuoteController.createServicesForQuote);
getQuoteRouter
  .route("/deleteServicesForQuote/:id")
  .delete(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, getQuoteController.deleteServicesForQuote);
getQuoteRouter
  .route("/getSingleQuote/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, getQuoteController.getSingleQuote);
getQuoteRouter.route("/getAllQuotes").get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, getQuoteController.getAllQuote);
getQuoteRouter.route("/trashQuote/:id").patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, getQuoteController.trashQuote);
getQuoteRouter.route("/unTrashQuote/:id").patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, getQuoteController.unTrashQuote);
getQuoteRouter.route("/deleteQuote/:id").delete(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, getQuoteController.deleteQuote);
