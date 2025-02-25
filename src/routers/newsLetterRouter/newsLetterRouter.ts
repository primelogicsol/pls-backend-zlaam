import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import newsLetterController from "../../controllers/newsLetterController/newsLetterController";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { sendNewsLetterToAllUsersSchema, sendNewsLetterToSingleUserSchema, SubscribeORunsubscribeToNewsLetterSchema } from "../../validation/zod";

export const newsLetterRouter = Router();

newsLetterRouter
  .route("/subscribeToNewsLetter")
  .post(validateDataMiddleware(SubscribeORunsubscribeToNewsLetterSchema), authMiddleware.checkToken, newsLetterController.subscribeToTheNewsLetter);

newsLetterRouter
  .route("/unSubscribeToNewsLetter")
  .post(validateDataMiddleware(SubscribeORunsubscribeToNewsLetterSchema), authMiddleware.checkToken, newsLetterController.unsubscribedFromNewsLetter);
newsLetterRouter
  .route("/sendNewsLetterToSingleSubscriber")
  .post(
    validateDataMiddleware(sendNewsLetterToSingleUserSchema),
    authMiddleware.checkToken,
    authMiddleware.checkIfUserIAdminOrModerator,
    (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 1),
    newsLetterController.sendNewsLetterToSingleSubscriber
  );
newsLetterRouter
  .route("/sendNewsLetterToAllSubscribers")
  .post(
    validateDataMiddleware(sendNewsLetterToAllUsersSchema),
    authMiddleware.checkToken,
    authMiddleware.checkIfUserIAdminOrModerator,
    newsLetterController.sendNewsLetterToAllSubscribers
  );
newsLetterRouter
  .route("/listAllSubscribedMails")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, newsLetterController.listAllSubscribedMails);
