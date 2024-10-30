import { Router } from "express";
import apiController from "../../controllers/apiController/apiController";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";

export const healthRouter = Router();

healthRouter.route("/").get((req, res, next) => rateLimiterMiddleware(req, res, next, 2), apiController.health);
