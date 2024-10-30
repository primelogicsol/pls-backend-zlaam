import { Router } from "express";
import healthController from "../../controllers/healthController/healthController";

export const healthRouter = Router();
// only for development
healthRouter.route("/").get(healthController.health);
