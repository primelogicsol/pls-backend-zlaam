import { Router } from "express";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { freeLancerSchema } from "../../validation/zod";
import freeLancerController from "../../controllers/freeLancerController/freeLancerController";
export const freeLancerRouter = Router();

freeLancerRouter.route("/getFreeLancerJoinUsRequest").post(validateDataMiddleware(freeLancerSchema), freeLancerController.getFreeLancerJoinUsRequest);
