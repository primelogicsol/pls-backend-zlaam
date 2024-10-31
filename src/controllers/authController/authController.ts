import type { Request, Response } from "express";
import { httpResponse } from "../../utils/apiResponseUtils";
import type { TUSERLOGIN, TUSERREGISTER } from "../../types";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { db } from "../../database/db";
import { ACESSTOKENCOOKIEOPTIONS, BADREQUESTCODE, REFRESHTOKENCOOKIEOPTIONS } from "../../constants";
import { passwordHasher, verifyPassword } from "../../services/passwordHasherService";
import tokenGeneratorService from "../../services/tokenGeneratorService";
import { generateOtp } from "../../services/slugStringGeneratorService";
import { sendOTP } from "../../services/sendOTPService";
export default {
  // ********* REGISTER USER *********
  registerUser: asyncHandler(async (req: Request, res: Response) => {
    // validation is already handled by the middleware
    const userData = req.body as TUSERREGISTER;
    const { username, fullName, email, password } = userData;
    const isUserExist = await db.user.findUnique({
      where: { username: username.toLowerCase(), email: email.toLowerCase() }
    });
    if (isUserExist) throw { status: BADREQUESTCODE, message: "user already exists with same username or email." };
    const hashedPassword = (await passwordHasher(password, res)) as string;
    const generateOneTimePassword = generateOtp()
    const hashedOTPPassword = await passwordHasher(generateOneTimePassword.otp, res) as string

    await db.user.create({
      data: { username: username.toLowerCase(), fullName, email: email.toLowerCase(), password: hashedPassword, role: "CLIENT", otpPassword: hashedOTPPassword, otpPasswordExpiry: generateOneTimePassword.otpExpiry }
    });
    await sendOTP(email, generateOneTimePassword.otp, fullName);
    httpResponse(req, res, 200, "Please verify your email wit 6 digit OTP sent to your email", { fullName, email });
  }),

  // ********* LOGIN USER *********
  loginUser: asyncHandler(async (req: Request, res: Response) => {
    // validation is already handled by the middleware
    const { email, password } = req.body as TUSERLOGIN;
    const user = await db.user.findUnique({ where: { email: email } });
    if (!user) throw { status: BADREQUESTCODE, message: "Invalid credentials" };
    const isPasswordMatch = await verifyPassword(password, user?.password, res);
    if (!isPasswordMatch) throw { status: BADREQUESTCODE, message: "Invalid credentials" };
    const { generateAccessToken, generateRefreshToken } = tokenGeneratorService;
    const accessToken = generateAccessToken(user.uid, res, "14m");
    const refreshToken = generateRefreshToken(user.uid, res, "7d");
    res.cookie("refreshToken", refreshToken, REFRESHTOKENCOOKIEOPTIONS).cookie("accessToken", accessToken, ACESSTOKENCOOKIEOPTIONS);
    httpResponse(req, res, 200, "User logged in successfully", { email, refreshToken, accessToken });
  })
};
