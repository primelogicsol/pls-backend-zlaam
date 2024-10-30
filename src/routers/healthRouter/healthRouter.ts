import { Router } from "express";
import apiController from "../../controllers/apiController/apiController";

export const healthRouter = Router();

healthRouter.route("/").get(apiController.health);
