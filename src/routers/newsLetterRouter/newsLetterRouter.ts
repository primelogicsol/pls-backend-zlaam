import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware";
import newsLetterController from "../../controllers/newsLetterController/newsLetterController";

export const newsLetterRouter = Router();

newsLetterRouter.route("/subscribeToNewsLetter").post(authMiddleware.checkToken, newsLetterController.subscribeToTheNewsLetter);

newsLetterRouter.route("/unSubscribeToNewsLetter").post(authMiddleware.checkToken, newsLetterController.unsubscribedFromNewsLetter);
newsLetterRouter
  .route("/sendNewsLetterToSingleUser")
  .post(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, newsLetterController.sendNewsLetterToSingleSubscriber);
newsLetterRouter
  .route("/sendNewsLetterToAllSubscribers")
  .post(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, newsLetterController.sendNewsLetterToAllSubscribers);
