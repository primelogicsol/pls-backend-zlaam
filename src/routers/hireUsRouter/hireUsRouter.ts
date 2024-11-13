import { Router } from "express";
import hireUsController from "../../controllers/hireUsController/hireUsController";
import { fileUploader } from "../../middlewares/multerMiddleware";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { hireUsSchema } from "../../validation/zod";
export const hireUsRouter = Router();
import authMiddleware from "../../middlewares/authMiddleware";
// import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";

hireUsRouter.route("/createHireUsRequest").post(
  fileUploader,
  validateDataMiddleware(hireUsSchema),

  // async (req, res, next) => {
  //   await rateLimiterMiddleware.handle(req, res, next, 10, undefined, 10, 28800);
  // },
  hireUsController.createHireUsRequest
);

hireUsRouter.route("/getAllHireUsRequests").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, hireUsController.getAllHireUsRequests);
hireUsRouter
  .route("/getSingleHireUsRequest/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, hireUsController.getSingleHireUsRequest);
hireUsRouter
  .route("/trashHireUsRequest/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, hireUsController.trashHireUsRequest);
hireUsRouter
  .route("/untrashHireUsRequest/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, hireUsController.untrashHireUsRequest);
hireUsRouter.route("/permanentDeleteHireUsRequest/:id").delete(
  // authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin,
  hireUsController.permanentDeleteHireUsRequest
);
