import type { Request, Response } from "express";
import { httpResponse } from "../../utils/apiResponseUtils";
import { TUSER } from "../../types";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { db } from "../../database/db";
import { BADREQUESTCODE } from "../../constants";
import { passwordHasher } from "../../services/passwordHasherService";
export default {
  registerUser: asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body as TUSER;
    const { username, fullName, email, password } = userData
    const isUserExist = await db.user.findUnique({
      where: { username, email },
    });
    if (isUserExist) throw { status: BADREQUESTCODE, message: "user already exists" }
    const hashedPassword = await passwordHasher(password, res) as string
    await db.user.create({
      data: { username, fullName, email, password: hashedPassword, role: "CLIENT" },
    },
    );
    httpResponse(req, res, 200, "User registered successfully", { fullName, email });
  })
};

