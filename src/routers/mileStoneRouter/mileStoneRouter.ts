import { Router } from "express";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { MilestoneProgressSchema, MilestoneSchema, MultipleMilestoneSchema } from "../../validation/zod";
import authMiddleware from "../../middlewares/authMiddleware";
import milestoneController from "../../controllers/milestoneController/milestoneController";
export const milestoneRouter: Router = Router();

milestoneRouter
  .route("/createMilestone/project/:projectId")
  .post(validateDataMiddleware(MilestoneSchema), authMiddleware.checkToken, milestoneController.createSingleProjectMilestone);

milestoneRouter
  .route("/createMultipleMilestones/project/:projectId")
  .post(validateDataMiddleware(MultipleMilestoneSchema), authMiddleware.checkToken, milestoneController.createMultipleMileStones);

milestoneRouter
  .route("/updateMilestone/milestone/:milestoneId")
  .put(validateDataMiddleware(MilestoneSchema), authMiddleware.checkToken, milestoneController.updateMileStone);

milestoneRouter.route("/deleteMilestone/milestone/:milestoneId").delete(authMiddleware.checkToken, milestoneController.deleteMileStone);

milestoneRouter.route("/completeMilestone/milestone/:milestoneId").put(authMiddleware.checkToken, milestoneController.completeMileStone);

milestoneRouter
  .route("/updateMilestoneProgress/milestone/:milestoneId")
  .put(validateDataMiddleware(MilestoneProgressSchema), authMiddleware.checkToken, milestoneController.updateMilestoneProgress);
