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
