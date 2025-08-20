// write all project request routes
import { Router } from "express";
import ProjectRequestController from "../../controllers/projectRequestController/projectRequestController";
import authMiddleware from "../../middlewares/authMiddleware";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";

const projectRequestRouter = Router();
//all routes should be in this formate
// freeLancerRouter.route("/getFreeLancerJoinUsRequestV2").post(
//   // validateDataMiddleware(freeLancerSchema),
//   (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 10, undefined, 10, 300),
//   freeLancerControllerV2.getFreeLancerJoinUsRequest
// );
projectRequestRouter.route("/create").post(
  // validateDataMiddleware(projectRequestSchema),
  (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 10, undefined, 10, 300),
  ProjectRequestController.create
);
projectRequestRouter.route("/").get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, ProjectRequestController.findAll);
projectRequestRouter.route("/:id").get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, ProjectRequestController.findById);
projectRequestRouter.route("/:id").delete(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, ProjectRequestController.delete);

export default projectRequestRouter;
