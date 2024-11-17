import { Router } from "express";
//import authMiddleware from "../../middlewares/authMiddleware";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { projectSchema } from "../../validation/zod";
import projectController from "../../controllers/projectController/projectController";
export const projectRouter = Router();

projectRouter.route("/createProject").post(
  validateDataMiddleware(projectSchema),
  //  authMiddleware.checkIfUserIAdminOrModerator,
  projectController.createProject
);
projectRouter.route("/getSingleProject/:projectSlug").get(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  projectController.getSingleProject
);

projectRouter.route("/getAllOutsourcedProjects").get(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  projectController.getAllOutsourcedProjects
);
projectRouter.route("/getAllInHouseProjects").get(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  projectController.getAllInHouseProjects
);

projectRouter.route("/deleteProject/:id").delete(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  projectController.deleteProject
);
