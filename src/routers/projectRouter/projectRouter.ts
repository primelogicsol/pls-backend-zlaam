import { Router } from "express";
//import authMiddleware from "../../middlewares/authMiddleware";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { projectSchema } from "../../validation/zod";
import projectController from "../../controllers/projectController/projectController";
import updateProjectController from "../../controllers/projectController/updateProjectController";
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
projectRouter.route("/getAllProjects").get(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.getAllProjects
);

projectRouter.route("/deleteProject/:id").delete(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  projectController.deleteProject
);
