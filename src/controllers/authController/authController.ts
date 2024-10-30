import type { Request, Response } from "express";
import { httpResponse } from "../../utils/apiResponseUtils";
import type { TUSERLOGIN, TUSERREGISTER } from "../../types";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { db } from "../../database/db";
import { BADREQUESTCODE } from "../../constants";
import { passwordHasher, verifyPassword } from "../../services/passwordHasherService";
export default {
  // ********* REGISTER USER *********
  registerUser: asyncHandler(async (req: Request, res: Response) => {
    // validation is already handled by the middleware
    const userData = req.body as TUSERREGISTER;
    const { username, fullName, email, password } = userData;
    const isUserExist = await db.user.findUnique({
      where: { username, email }
    });
    if (isUserExist) throw { status: BADREQUESTCODE, message: "user already exists with same username or email." };
    const hashedPassword = (await passwordHasher(password, res)) as string;
    await db.user.create({
      data: { username, fullName, email, password: hashedPassword, role: "CLIENT" }
    });
    httpResponse(req, res, 200, "User registered successfully", { fullName, email });
  }),

  // ********* LOGIN USER *********
  loginUser: asyncHandler(async (req: Request, res: Response) => {
    // validation is already handled by the middleware
    const { email, password } = req.body as TUSERLOGIN;
    const user = await db.user.findUnique({ where: { email: email } });
    if (!user) throw { status: BADREQUESTCODE, message: "Invalid email" };
    const isPasswordMatch = await verifyPassword(password, user?.password, res);
    if (!isPasswordMatch) throw { status: BADREQUESTCODE, message: "Invalid password" };

    httpResponse(req, res, 200, "User logged in successfully", { email });
  })
};
