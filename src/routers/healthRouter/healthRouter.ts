import { Router } from "express";
import apiController from "../../controllers/apiController/apiController";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";

export const healthRouter = Router();

healthRouter.route("/").get(rateLimiterMiddleware, apiController.health);
