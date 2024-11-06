import { Router } from "express";
import contactUsController from "../../controllers/contactUsController/contactUsController";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
import { contactUsSchema } from "../../validation/zod";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";

export const contactUsRouter = Router();

contactUsRouter
  // this route only for client
  .route("/createMessage")
  .post(
    //   authMiddleware.checkToken,
    validateDataMiddleware(contactUsSchema),
    (req, res, next) => rateLimiterMiddleware(req, res, next, 5),
    contactUsController.createMessage
  );
contactUsRouter
  .route("/getAllMessages")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, contactUsController.getAllMessages);

contactUsRouter
  .route("/getSingleMessage/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, contactUsController.getSingleMessage);
contactUsRouter.route("/deleteMessage/:id").delete(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, contactUsController.deleteMessage);

contactUsRouter
  .route("/sendMessageToUser/:id")
  .post(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, contactUsController.sendMessageToUser);

contactUsRouter
  .route("/moveMessageToTrash")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, contactUsController.trashMessage);
contactUsRouter.route("/unTrashMessage").patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, contactUsController.unTrashMessage);
