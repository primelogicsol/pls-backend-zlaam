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
// *************************Update Project Details

projectRouter.route("/createInterestedFreelancers/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.createInterestedFreelancers
);

projectRouter.route("/removeFreelancerFromInterestedList/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.removeFreelancerFromInterestedList
);

projectRouter.route("/listInterestedFreelancersInSingleProject/:projectSlug").get(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.listInterestedFreelancersInSingleProject
);

projectRouter.route("/selectFreelancerForProject/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.selectFreelancerForProject
);

projectRouter.route("/removeSelectedFreelancer/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.removeSelectedFreelancer
);

projectRouter.route("/updateProgressOfProject/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.updateProgressOfProject
);

projectRouter.route("/changeProjectStatus/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.changeProjectStatus
);

projectRouter.route("/changeProjectType/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.changeProjectType
);
projectRouter.route("/writeReviewAndGiveRating/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.writeReviewAndGiveRating
);

projectRouter.route("/updateProjectBySlug/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.updateProjectBySlug
);
projectRouter.route("/makeProjectOutsource/:projectSlug").patch(
  //  authMiddleware.checkIfUserIAdminOrModerator,
  updateProjectController.makeProjectOutsource
);
