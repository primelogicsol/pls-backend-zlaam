import { Router } from "express";

import authController from "../../controllers/authController/authController";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { userRegistrationSchema } from "../../validation/zod";
export const authRouter = Router();

// Routes**
authRouter.route("/register").post(validateDataMiddleware(userRegistrationSchema), authController.registerUser);
