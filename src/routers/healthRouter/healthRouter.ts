import { Router } from "express";
import apiController from "../../controllers/apiController/apiController";

export const healthRouter = Router();
// only for development
healthRouter.route("/").get(apiController.health);
