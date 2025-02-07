import { Router } from "express";

import authController from "../../controllers/authController/authController";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import {
  forgotPasswordRequestFromUserSchema,
  sendOTPSchema,
  updateForgotPasswordSchema,
  userDeleteSchema,
  userLoginSchema,
  userRegistrationSchema,
  userUpdateEmailSchema,
  userUpdatePasswordSchema,
  userUpdateSchema,
  verifyForgotPasswordRequestSchema,
  verifyUserSchema
} from "../../validation/zod";
// import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
import { OTPALREADYSENT } from "../../constants/index";
import userController from "../../controllers/authController/userController";
import authMiddleware from "../../middlewares/authMiddleware";
import rateLimiterMiddleware from "../../middlewares/rateLimiterMiddleware";
export const authRouter = Router();

// Routes**
authRouter
  .route("/register")
  .post(
    validateDataMiddleware(userRegistrationSchema),
    (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 5),
    authController.registerUser
  );

authRouter
  .route("/verifyEmail")
  // 2 req per minute from single  ip adress
  .post(validateDataMiddleware(verifyUserSchema), (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 5), authController.verifyUser);

authRouter
  .route("/sendOTP")
  // 1 req per minute from single  ip adress
  .post(
    validateDataMiddleware(sendOTPSchema),
    (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 10, OTPALREADYSENT),
    authController.sendOTP
  );

authRouter
  .route("/login")
  // 5 req per mnute from single  ip adress
  .post(
    validateDataMiddleware(userLoginSchema),
    (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 5, undefined, 20, 180),
    authController.loginUser
  );

authRouter.route("/logoutUser").get(authMiddleware.checkToken, authController.logOut);
authRouter.route("/logoutUserForceFully").post(authMiddleware.checkToken, authController.logOutUserForecfully);

authRouter.route("/updateInfo").patch(
  authMiddleware.checkToken,
  validateDataMiddleware(userUpdateSchema),
  // 1 req per minute from single  ip adress
  (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 10),
  userController.updateInfo
);
authRouter.route("/updateEmail").patch(
  authMiddleware.checkToken,
  validateDataMiddleware(userUpdateEmailSchema),
  // 1 req per minute from single  ip adress
  (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 10),
  userController.updateEmail
);

authRouter.route("/updatePassword").patch(
  authMiddleware.checkToken,
  validateDataMiddleware(userUpdatePasswordSchema),
  // 1 req per minute from single  ip adress
  (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 10),
  userController.updatePassword
);
authRouter.route("/updateRole").patch(
  authMiddleware.checkToken,
  authMiddleware.checkIfUserIsAdmin,
  // 2 req per minute from single  ip adress
  (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 2),
  userController.updateRole
);
authRouter.route("/getSingleUser").get(authMiddleware.checkToken, validateDataMiddleware(userDeleteSchema), userController.getSingleUser);

authRouter.route("/getAllUsers").get(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, userController.getAllUsers);

authRouter.route("/searchUsers").get(authMiddleware.checkToken, userController.searchUser);
authRouter.route("/getCurrentUser").get(authMiddleware.checkToken, userController.getCurrentUser);

authRouter
  .route("/deleteUser")
  .delete(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, validateDataMiddleware(userDeleteSchema), userController.deleteUser);
authRouter.route("/trashTheUser").patch(authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, userController.moveToTrash);
authRouter.route("/unTrashTheUser").patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, userController.unTrashUser);
// ** forgot password
authRouter
  .route("/forgotPasswordRequestFromUser")
  .post(validateDataMiddleware(forgotPasswordRequestFromUserSchema), userController.forgotPasswordRequestFromUser);
authRouter
  .route("/verifyForgotPasswordRequest")
  .post(validateDataMiddleware(verifyForgotPasswordRequestSchema), userController.verifyForgotPasswordRequest);
authRouter.route("/updateNewPasswordRequest").patch(validateDataMiddleware(updateForgotPasswordSchema), userController.updateNewPasswordRequest);
authRouter.route("/refreshAcessToken").post(authController.refreshAcessToken);
