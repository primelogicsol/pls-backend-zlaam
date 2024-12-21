import { Router } from "express";
import navigationPagesController from "../../controllers/navigationPagesController/navigationPagesController";
import authMiddleware from "../../middlewares/authMiddleware";

export const navigationPagesRouter = Router();

navigationPagesRouter.route("/createNavigationPage").post(
  // authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator,
  navigationPagesController.createNavigationPage
);
navigationPagesRouter
  .route("/getSingleNavigationPage/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, navigationPagesController.getSingleNavigationPage);
navigationPagesRouter.route("/getAllNavigationPages").get(
  // authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator,
  navigationPagesController.getAllNavigationPages
);
navigationPagesRouter
  .route("/updateNavigationPage/:id")
  .put(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, navigationPagesController.updateNavigationPage);
navigationPagesRouter.route("/deleteNavigationPage/:id").delete(
  // authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator,
  navigationPagesController.deleteNavigationPage
);
navigationPagesRouter
  .route("/trashNavigationPage/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, navigationPagesController.trashNavigationPage);
navigationPagesRouter
  .route("/untrashNavigationPage/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, navigationPagesController.untrashNavigationPage);

navigationPagesRouter.route("/menuItems/:id/addChildrenToMenuItem").patch(
  // authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin,
  navigationPagesController.addChildrenToMenuItem
);
