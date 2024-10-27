import { Router } from "express";

import authController from "../../controllers/authController/authController";
export const authRouter = Router();

// Routes**
authRouter.route("/self").get(authController.self);
