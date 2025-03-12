import { Router } from "express";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { MilestoneProgressSchema, MilestoneSchema, MultipleMilestoneSchema } from "../../validation/zod";
import authMiddleware from "../../middlewares/authMiddleware";
import milestoneController from "../../controllers/milestoneController/milestoneController";
export const milestoneRouter: Router = Router();

milestoneRouter
  .route("/createMilestone/:projectId")
  .post(
    validateDataMiddleware(MilestoneSchema),
    authMiddleware.checkToken,
    authMiddleware.checkIfUserIAdminOrModerator,
    milestoneController.createSingleProjectMilestone
  );

milestoneRouter
  .route("/createMultipleMilestones/:projectId")
  .post(
    validateDataMiddleware(MultipleMilestoneSchema),
    authMiddleware.checkToken,
    authMiddleware.checkIfUserIAdminOrModerator,
    milestoneController.createMultipleMileStones
  );

milestoneRouter
  .route("/updateMilestone/:milestoneId")
  .patch(
    validateDataMiddleware(MilestoneSchema),
    authMiddleware.checkToken,
    authMiddleware.checkIfUserIAdminOrModerator,
    milestoneController.updateMileStone
  );

milestoneRouter
  .route("/deleteMilestone/:milestoneId")
  .delete(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, milestoneController.deleteMileStone);

// ** If freelancer already completed the milestone  he can mark it as a completed and progress point will be full
milestoneRouter
  .route("/completeMilestone/:milestoneId")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdminModeratorOrFreeLancer, milestoneController.completeMileStone);
// ** For freelancer to update milestone progress
milestoneRouter
  .route("/updateMilestoneProgress/:milestoneId")
  .patch(
    validateDataMiddleware(MilestoneProgressSchema),
    authMiddleware.checkToken,
    authMiddleware.checkIfUserIsAdminModeratorOrFreeLancer,
    milestoneController.updateMilestoneProgress
  );
