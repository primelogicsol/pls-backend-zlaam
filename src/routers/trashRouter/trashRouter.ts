import { Router } from "express";
import trashUserController from "../../controllers/trashController/trashUserController";
import trashMessages from "../../controllers/trashController/trashMessages";
import authMiddleware from "../../middlewares/authMiddleware";
import trashNavigationPagesController from "../../controllers/trashController/trashNavigationPagesController";
import trashGetQuotes from "../../controllers/trashController/trashGetQuotes";
import trashConsultations from "../../controllers/trashController/trashConsultations";
import trashHireUsController from "../../controllers/trashController/trashHireUsController";
import trashContactUs from "../../controllers/trashController/trashContactUs";

export const trashRouter = Router();

trashRouter.route("/getTrashedUsers").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashUserController.getTrashedUsers);
trashRouter.route("/getTrashedMessages").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashMessages.getAllTrashedMessages);
trashRouter
  .route("/getTrashedNavigationPages")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashNavigationPagesController.trashedNavigationPages);
trashRouter.route("/getTrashedQuotes").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashGetQuotes.getTrashedQuotes);
trashRouter
  .route("/getTrashedConsultations")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashConsultations.getAllTrashedConsultations);

trashRouter.route("/getTrashedHireUs").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashHireUsController.getAllTrashedHireUs);
trashRouter.route("/getTrashedContactUs").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, trashContactUs.getTrashedContactUs);
