import { Router } from "express";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { freeLancerSchema } from "../../validation/zod";
import freeLancerController from "../../controllers/freeLancerController/freeLancerController";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";
export const freeLancerRouter = Router();

freeLancerRouter
  .route("/getFreeLancerJoinUsRequest")
  .post(
    validateDataMiddleware(freeLancerSchema),
    (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 10, undefined, 10, 300),
    freeLancerController.getFreeLancerJoinUsRequest
  );
freeLancerRouter
  .route("/getAllFreeLancerRequest")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.getAllFreeLancerRequest);
freeLancerRouter
  .route("/getSingleFreeLancerRequest/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.getSingleFreeLancerRequest);
freeLancerRouter
  .route("/deleteFreeLancerRequest/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.deleteFreeLancerRequest);
freeLancerRouter
  .route("/trashFreeLancerRequest/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.trashFreeLancerRequest);
freeLancerRouter
  .route("/untrashFreeLancerRequest/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, freeLancerController.untrashFreeLancerRequest);
freeLancerRouter
  .route("/createNicheListForFreelancer/")
  .post(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.createNicheListForFreelancer);
freeLancerRouter
  .route("/deleteNicheForFreelancer/:id")
  .delete(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.deleteNicheForFreelancer);
freeLancerRouter
  .route("/listAllNichesForFreelancer")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.listAllNichesForFreelancer);
freeLancerRouter
  .route("/listSingleNicheForFreelancer/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.listSingleNicheForFreelancer);
freeLancerRouter
  .route("/updateNicheForFreelancer/:id")
  .put(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.updateNicheForFreelancer);
freeLancerRouter
  .route("/acceptFreeLancerRequest/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, freeLancerController.acceptFreeLancerRequest);
freeLancerRouter
  .route("/listAllFreelancers")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdminModeratorOrFreeLancer, freeLancerController.listAllTheFreelancers);
freeLancerRouter
  .route("/listSingleFreelancer/:username")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdminModeratorOrFreeLancer, freeLancerController.listSingleFreelancer);
