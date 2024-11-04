import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { BADREQUESTCODE, SUCCESSCODE, UNAUTHORIZEDCODE, UNAUTHORIZEDMSG } from "../../constants";
import type { TUSERREGISTER, TUSERUPDATE } from "../../types";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { passwordHasher, verifyPassword } from "../../services/passwordHasherService";
import type { _Request } from "../../middlewares/authMiddleware";

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
  // ** deleteUser controller
  deleteUser: asyncHandler(async (req: Request, res: Response) => {
    // ** validation is already handled by the middleware
    const userData = req.body as TUSERUPDATE;
    const { uid } = userData;
    await db.user.delete({ where: { uid } });
    httpResponse(req, res, SUCCESSCODE, "User deleted successfully");
  }),
  // ** get single user
  getSingleUser: asyncHandler(async (req: Request, res: Response) => {
    const { uid } = req.body as TUSERUPDATE;
    const user = await db.user.findUnique({
      where: { uid },
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
    const totalUsers = await db.user.count();
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

    const users: TUSERREGISTER[] = await db.$queryRaw`
      SELECT * FROM "User"
      WHERE to_tsvector('english', "username" || ' ' || "email" || ' ' || "fullName") @@ plainto_tsquery('english', ${searchQuery})
      ORDER BY "createdAt" DESC
      OFFSET ${skip} LIMIT ${take}
    `;

    const totalUsersCount: { count: string }[] = await db.$queryRaw`
      SELECT COUNT(*) FROM "User"
      WHERE to_tsvector('english', "username" || ' ' || "email" || ' ' || "fullName") @@ plainto_tsquery('english', ${searchQuery})
    `;

    const UsersCount = Number(totalUsersCount[0]?.count);
    const totalPages = Math.ceil(UsersCount / take);
    const hasNextPage = totalPages > pageNumber;
    const hasPreviousPage = pageNumber > 1;
    const filteredUsers = users.map((user) => {
      return {
        uid: user.uid,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
        role: user.role
      };
    });
    httpResponse(req, res, SUCCESSCODE, "Data searched successfully", {
      filteredUsers,
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
  })
};
