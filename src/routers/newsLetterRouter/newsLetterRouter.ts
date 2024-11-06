import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import newsLetterController from "../../controllers/newsLetterController/newsLetterController";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";

export const newsLetterRouter = Router();

newsLetterRouter.route("/subscribeToNewsLetter").post(authMiddleware.checkToken, newsLetterController.subscribeToTheNewsLetter);

newsLetterRouter.route("/unSubscribeToNewsLetter").post(authMiddleware.checkToken, newsLetterController.unsubscribedFromNewsLetter);
newsLetterRouter
  .route("/sendNewsLetterToSingleUser")
  .post(
    authMiddleware.checkToken,
    authMiddleware.checkIfUserIAdminOrModerator,
    (req, res, next) => rateLimiterMiddleware(req, res, next, 1),
    newsLetterController.sendNewsLetterToSingleSubscriber
  );
newsLetterRouter
  .route("/sendNewsLetterToAllSubscribers")
  .post(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, newsLetterController.sendNewsLetterToAllSubscribers);
