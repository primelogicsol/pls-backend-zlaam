import { Router } from "express";
import trashUserController from "../../controllers/trashController/trashUserController";
import trashMessages from "../../controllers/trashController/trashMessages";
import authMiddleware from "../../middlewares/authMiddleware";
import trashNavigationPagesController from "../../controllers/trashController/trashNavigationPagesController";

export const trashRouter = Router();

trashRouter.route("/getTrashedUsers").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashUserController.getTrashedUsers);
trashRouter.route("/getTrashedMessages").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashMessages.getAllTrashedMessages);
trashRouter
  .route("/getTrashedNavigationPages")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashNavigationPagesController.trashedNavigationPages);
