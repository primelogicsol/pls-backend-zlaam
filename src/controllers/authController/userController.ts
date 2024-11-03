import type { Response } from "express";
import type { _Request } from "../../middlewares/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { BADREQUESTCODE, SUCCESSCODE, UNAUTHORIZEDCODE, UNAUTHORIZEDMSG } from "../../constants";
import type { TUSERUPDATE } from "../../types";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { passwordHasher, verifyPassword } from "../../services/passwordHasherService";

export default {
  // ** updateUserInfo controller
  updateInfo: asyncHandler(async (req: _Request, res: Response) => {
    // ** validation is already handled by the middleware
    const uid = req.userFromToken?.uid
    if (!uid) throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    const userData = req.body as TUSERUPDATE;
    const { username, fullName } = userData;

    const isUserAlreadyExist = await db.user.findFirst({
      where: {
        username: username.toLowerCase(),
        uid: { not: uid },
      },
    });
    if (isUserAlreadyExist) throw { status: BADREQUESTCODE, message: "user already exists with same username" };
    const updatedUser = await db.user.update({
      where: { uid },
      data: {
        username,
        fullName,
      },
      select: { username: true, fullName: true, },
    });
    httpResponse(req, res, SUCCESSCODE, "User updated successfully", updatedUser);
  }),

  // ** updateEmail controllelr
  updateEmail: asyncHandler(async (req: _Request, res: Response) => {
    // ** validation is already handled by the middleware
    const uid = req.userFromToken?.uid
    if (!uid) throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    const userData = req.body as TUSERUPDATE;
    const { email } = userData;
    const isUserAlreadyExist = await db.user.findFirst({
      where: {
        email: email.toLowerCase(),
        uid: { not: uid },
      },
    });
    if (isUserAlreadyExist) throw { status: BADREQUESTCODE, message: "user already exists with same email" };
    const updatedUser = await db.user.update({
      where: { uid },
      data: {
        email,
        emailVerifiedAt: null,
        tokenVersion: { increment: 1 }
      },
      select: { email: true, updatedAt: true, tokenVersion: true },
    });
    httpResponse(req, res, SUCCESSCODE, "User updated successfully", updatedUser);
  }),
  // ** updatePassword controllelr
  updatePassword: asyncHandler(async (req: _Request, res: Response) => {
    // ** validation is already handled by the middleware
    const uid = req.userFromToken?.uid
    if (!uid) throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    const userData = req.body as TUSERUPDATE;
    const { oldPassword, password } = userData;

    const user = await db.user.findUnique({ where: { uid } });
    if (!user) throw { status: BADREQUESTCODE, message: "Invalid credentials" };
    const isPasswordMatch = await verifyPassword(oldPassword, user?.password, res);
    if (!isPasswordMatch) throw { status: BADREQUESTCODE, message: "Invalid credentials" };
    const hashedPassword = (await passwordHasher(password, res)) as string;
    await db.user.update({
      where: { uid },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 },
      },
    });
    httpResponse(req, res, SUCCESSCODE, "User password updated successfully");
  }),
  // ** updateRole controllelr
  updateRole: asyncHandler(async (req: _Request, res: Response) => {
    // ** validation is already handled by the middleware
    const uid = req.userFromToken?.uid
    if (!uid) throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    const userData = req.body as TUSERUPDATE;
    const { role } = userData;
    const updatedUser = await db.user.update({
      where: { uid },
      data: {
        role: role
      },
      select: { role: true }
    });
    httpResponse(req, res, SUCCESSCODE, "User role updated successfully", updatedUser);
  })
};
