import { Router } from "express";
import hireUsController from "../../controllers/hireUsController/hireUsController";
import { fileUploader } from "../../middlewares/multerMiddleware";
export const hireUsRouter = Router();

hireUsRouter.route("/createHireUs").post(fileUploader, hireUsController.hireUs);
