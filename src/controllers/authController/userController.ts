import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { BADREQUESTCODE, REFRESHTOKENCOOKIEOPTIONS, SUCCESSCODE, UNAUTHORIZEDCODE, UNAUTHORIZEDMSG } from "../../constants";
import type { TSENDOTP, TTRASH, TUSERUPDATE, TVERIFYUSER } from "../../types";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { passwordHasher, verifyPassword } from "../../services/passwordHasherService";
import type { _Request } from "../../middlewares/authMiddleware";
import { generateOtp } from "../../services/slugStringGeneratorService";
import { sendOTP } from "../../services/sendOTPService";
import logger from "../../utils/loggerUtils";

export default {
  // ** updateUserInfo controller
  updateInfo: asyncHandler(async (req: Request, res: Response) => {
    // ** validation is already handled by the middleware
    const userData = req.body as TUSERUPDATE;
    const { uid, username, fullName } = userData;

    const isUserAlreadyExist = await db.user.findFirst({
      where: {
        username: username.toLowerCase(),
        uid: { not: uid }
      }
    });
    if (isUserAlreadyExist) throw { status: BADREQUESTCODE, message: "user already exists with same username" };
    const updatedUser = await db.user.update({
      where: { uid },
      data: {
        username,
        fullName
      },
      select: { username: true, fullName: true }
    });
    httpResponse(req, res, SUCCESSCODE, "User updated successfully", updatedUser);
  }),

  // ** updateEmail controllelr
  updateEmail: asyncHandler(async (req: Request, res: Response) => {
    // ** validation is already handled by the middleware
    const userData = req.body as TUSERUPDATE;
    const { uid, email } = userData;
    const isUserAlreadyExist = await db.user.findFirst({
      where: {
        email: email.toLowerCase(),
        uid: { not: uid }
      }
    });
    if (isUserAlreadyExist) throw { status: BADREQUESTCODE, message: "user already exists with same email" };
    const updatedUser = await db.user.update({
      where: { uid },
      data: {
        email,
        emailVerifiedAt: null,
        tokenVersion: { increment: 1 }
      },
      select: { email: true, updatedAt: true, tokenVersion: true }
    });
    httpResponse(req, res, SUCCESSCODE, "User updated successfully", updatedUser);
  }),
  // ** updatePassword controllelr
  updatePassword: asyncHandler(async (req: Request, res: Response) => {
    // ** validation is already handled by the middleware
    const userData = req.body as TUSERUPDATE;
    const { uid, oldPassword, newPassword: password } = userData;

    const user = await db.user.findUnique({ where: { uid } });
    if (!user) throw { status: BADREQUESTCODE, message: "Invalid credentials" };
    const isPasswordMatch = await verifyPassword(oldPassword, user?.password, res);
    if (!isPasswordMatch) throw { status: BADREQUESTCODE, message: "Invalid credentials" };
    const hashedPassword = (await passwordHasher(password, res)) as string;
    await db.user.update({
      where: { uid },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 }
      }
    });
    httpResponse(req, res, SUCCESSCODE, "User password updated successfully");
  }),
  // ** updateRole controller
  updateRole: asyncHandler(async (req: Request, res: Response) => {
    // ** validation is already handled by the middleware
    const userData = req.body as TUSERUPDATE;
    const { role, uid } = userData;
    if (!role || !uid) {
      throw { status: BADREQUESTCODE, message: "Role and UID is required" };
    }
    const updatedUser = await db.user.update({
      where: { uid },
      data: {
        role: role,
        tokenVersion: { increment: 1 }
      },
      select: { role: true }
    });
    httpResponse(req, res, SUCCESSCODE, "User role updated successfully", updatedUser);
  }),
  // ** get single user
  getSingleUser: asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.body as TUSERUPDATE;
    const user = await db.user.findUnique({
      where: { username },
      select: { username: true, email: true, fullName: true, emailVerifiedAt: true, uid: true }
    });
    httpResponse(req, res, SUCCESSCODE, "User fetched successfully", user);
  }),
  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    if (isNaN(pageNumber) || isNaN(pageLimit) || pageNumber <= 0 || pageLimit <= 0) {
      throw { status: 400, message: "Invalid pagination parameters!!" };
    }

    const skip = (pageNumber - 1) * pageLimit;
    const take = pageLimit;
    const users = await db.user.findMany({
      where: {
        trashedAt: null,
        trashedBy: null
      },
      select: {
        uid: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true
      },
      skip,
      take,
      orderBy: {
        createdAt: "asc"
      }
    });
    const totalUsers = await db.user.count({ where: { trashedAt: null, trashedBy: null } });
    const totalPages = Math.ceil(totalUsers / pageLimit);

    const hasNextPage = totalPages > pageNumber;
    const hasPreviousPage = pageNumber > 1;
    httpResponse(req, res, SUCCESSCODE, "Users fetched successfully", {
      users,
      pagination: { totalPages, totalUsers, currentPage: pageNumber, hasPreviousPage, hasNextPage }
    });
  }),
  // ** search Usercontroller
  searchUser: asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) throw { status: 400, message: "Search query is required!!" };

    const searchQuery = q as string;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
      throw { status: 400, message: "Invalid pagination parameters!!" };
    }

    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;

    const users: {
      uid: string;
      username: string;
      fullName: string;
      email: string;
      emailVerifiedAt: Date | null;
      role: string;
    }[] = await db.$queryRaw`
  SELECT "uid", "username", "fullName", "email", "emailVerifiedAt", "role"
  FROM "User"
  WHERE to_tsvector('english', "username" || ' ' || "email" || ' ' || "fullName") @@ plainto_tsquery('english', ${searchQuery})
    AND ("trashedBy" IS NULL OR "trashedAt" IS NULL) -- only non-trashed users
  ORDER BY "createdAt" DESC
  OFFSET ${skip} LIMIT ${take}
`;

    const totalUsersCount: { count: string }[] = await db.$queryRaw`
  SELECT COUNT(*) FROM "User"
  WHERE to_tsvector('english', "username" || ' ' || "email" || ' ' || "fullName") @@ plainto_tsquery('english', ${searchQuery})
    AND ("trashedBy" IS NULL OR "trashedAt" IS NULL) -- count only non-trashed users
`;

    const UsersCount = Number(totalUsersCount[0]?.count);
    const totalPages = Math.ceil(UsersCount / take);
    const hasNextPage = totalPages > pageNumber;
    const hasPreviousPage = pageNumber > 1;

    httpResponse(req, res, SUCCESSCODE, "Data searched successfully", {
      users, // users array now only contains specified fields
      pagination: { hasNextPage, hasPreviousPage, totalPages, currentPage: pageNumber }
    });
  }),
  // ** get Current Usercontroller
  getCurrentUser: asyncHandler(async (req: _Request, res: Response) => {
    const uid = req.userFromToken?.uid;
    if (!uid) throw { status: UNAUTHORIZEDCODE, message: UNAUTHORIZEDMSG };
    const user = await db.user.findUnique({
      where: { uid },
      select: { username: true, email: true, fullName: true, emailVerifiedAt: true, uid: true }
    });
    httpResponse(req, res, SUCCESSCODE, "User fetched successfully", user);
  }),

  // *** Move to the trash ****************************
  moveToTrash: asyncHandler(async (req: _Request, res: Response) => {
    const { victimUid } = req.body as TTRASH;
    const trashedBy = req.userFromToken?.uid;
    if (!trashedBy) throw { status: BADREQUESTCODE, message: "Please Send the id of user who want to trash it" };
    const user = await db.user.findUnique({ where: { uid: trashedBy } });
    if (!user) throw { status: BADREQUESTCODE, message: "You aren't allowed to trash data" };
    if (!victimUid) throw { status: BADREQUESTCODE, message: "Please Send the id of victim" };
    const victim = await db.user.findUnique({ where: { uid: victimUid } });
    if (!victim) throw { status: BADREQUESTCODE, message: "User not found" };
    if (victim.role === "ADMIN") throw { status: BADREQUESTCODE, message: "Admin can't be moved in trash " };
    await db.user.update({
      where: { uid: victimUid },
      data: {
        trashedBy: `@${user?.username} - ${user?.fullName} - ${user?.role}`,
        trashedAt: new Date()
      }
    });
    httpResponse(req, res, SUCCESSCODE, "Data moved to trash successfully.");
  }),
  // *** Untrash User
  unTrashUser: asyncHandler(async (req: Request, res: Response) => {
    const { victimUid } = req.body as TTRASH;
    if (!victimUid) throw { status: BADREQUESTCODE, message: "Please Send the id of victim" };
    const victim = await db.user.findUnique({ where: { uid: victimUid } });
    if (!victim) throw { status: BADREQUESTCODE, message: "User not found" };
    await db.user.update({
      where: { uid: victimUid },
      data: {
        trashedBy: null,
        trashedAt: null
      }
    });
    httpResponse(req, res, SUCCESSCODE, "Data untrashed successfully.");
  }),

  // ** deleteUser controller
  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    // ** validation is already handled by the middleware
    const userData = req.body as TUSERUPDATE;
    const { uid } = userData;
    await db.user.delete({ where: { uid } });
    httpResponse(req, res, SUCCESSCODE, "User deleted successfully");
  }),

  // ** Forgot Password Request From  User Controller **************
  forgotPasswordRequestFromUser: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as TSENDOTP;
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user?.password === "") {
      httpResponse(req, res, SUCCESSCODE, "Password already reset please create new one", { uid: user.uid });
      return;
    }
    if (!user) throw { status: BADREQUESTCODE, message: "Invalid email" };
    if (!user.emailVerifiedAt) throw { status: BADREQUESTCODE, message: "Please verify your email first" };
    const generateOneTimePassword = generateOtp();
    await db.user.update({
      where: { email: email.toLowerCase() },
      data: {
        otpPassword: generateOneTimePassword.otp,
        otpPasswordExpiry: generateOneTimePassword.otpExpiry
      }
    });
    await sendOTP(email, generateOneTimePassword.otp, user.fullName, "Please use this OTP to reset your password", "Reset Password");
    httpResponse(req, res, SUCCESSCODE, "OTP sent successfully", { email });
  }),
  // ** Verify Forgot Password Request Controller ******
  verifyForgotPasswordRequest: asyncHandler(async (req: _Request, res: Response) => {
    // validation is already handled by the middleware
    const { OTP } = req.body as TVERIFYUSER;

    const user = await db.user.findUnique({ where: { otpPassword: OTP } });
    if (user?.password === "") {
      httpResponse(req, res, SUCCESSCODE, "OTP verified successfully", { uid: user.uid });
      return;
    }
    if (!user) {
      logger.error("User not found");
      throw { status: BADREQUESTCODE, message: "Invalid OTP" };
    }
    if (user.otpPasswordExpiry && user.otpPasswordExpiry < new Date()) {
      await db.user.update({
        where: { otpPassword: OTP },
        data: {
          otpPassword: null,
          otpPasswordExpiry: null
        }
      });
      throw { status: BADREQUESTCODE, message: "OTP expired. Please try again" };
    }
    const updatedUser = await db.user.update({
      where: { otpPassword: OTP },
      data: {
        otpPassword: null,
        otpPasswordExpiry: null,
        password: ""
      }
    });

    res.cookie("rndID", updatedUser.uid, REFRESHTOKENCOOKIEOPTIONS);
    httpResponse(req, res, SUCCESSCODE, "OTP verified successfully", { uid: updatedUser.uid });
  }),

  // *****  update New Password Request Controller **********
  updateNewPasswordRequest: asyncHandler(async (req: _Request, res: Response) => {
    const { newPassword } = req.body as TUSERUPDATE;
    const { uid } = req.body as { uid: string };

    if (!uid) throw { status: BADREQUESTCODE, message: "Please send uid" };
    const user = await db.user.findUnique({ where: { uid: uid } });
    if (user?.password !== "") throw { status: BADREQUESTCODE, message: "You are not allowed to change your password" };
    if (!newPassword) throw { status: BADREQUESTCODE, message: "Please send password" };
    const hashedPassword = (await passwordHasher(newPassword, res)) as string;
    await db.user.update({
      where: { uid: uid },
      data: {
        password: hashedPassword
      }
    });
    httpResponse(req, res, SUCCESSCODE, "Password updated successfully");
  })
};
