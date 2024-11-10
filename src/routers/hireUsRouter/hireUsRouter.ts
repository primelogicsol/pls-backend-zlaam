import { Router } from "express";
import hireUsController from "../../controllers/hireUsController/hireUsController";
import { fileUploader } from "../../middlewares/multerMiddleware";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { hireUsSchema } from "../../validation/zod";
export const hireUsRouter = Router();

hireUsRouter.route("/createHireUs").post(fileUploader, validateDataMiddleware(hireUsSchema), hireUsController.hireUs);
