import { Router } from "express";
import consultationController from "../../controllers/consultationController/consultationController";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { consultationBookingSchema } from "../../validation/zod";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
import authMiddleware from "../../middlewares/authMiddleware";

export const consultationRouter = Router();

consultationRouter.route("/requestAConsultation").post(
  validateDataMiddleware(consultationBookingSchema),
  async (req, res, next) => {
    await rateLimiterMiddleware.handle(req, res, next, 10, undefined, 10, 28800);
  },
  consultationController.createConsultation
);
consultationRouter.route("/updateRequestedConsultation/:id").post(
  validateDataMiddleware(consultationBookingSchema),
  async (req, res, next) => {
    await rateLimiterMiddleware.handle(req, res, next, 10, undefined, 10, 28800);
  },
  consultationController.updateConsultation
);
consultationRouter
  .route("/getAllRequestedConsultations")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, consultationController.getAllRequestedConsultations);
consultationRouter
  .route("/getSingleRequestedConsultation/:id")
  .get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, consultationController.getSingleRequestedConsultation);
consultationRouter
  .route("/deleteRequestedConsultation/:id")
  .delete(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, consultationController.deleteRequestedConsultation);
consultationRouter
  .route("/acceptRequestedConsultation/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, consultationController.acceptConsultationBooking);
consultationRouter
  .route("/rejectRequestedConsultation/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, consultationController.rejectConsultationBooking);
consultationRouter
  .route("/trashRequestedConsultation/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, consultationController.trashConsultation);
consultationRouter
  .route("/untrashRequestedConsultation/:id")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, consultationController.untrashConsultation);
