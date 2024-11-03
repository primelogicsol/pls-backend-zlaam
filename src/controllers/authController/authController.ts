import type { Request, Response } from "express";
import { httpResponse } from "../../utils/apiResponseUtils";
import type { TPAYLOAD, TSENDOTP, TUSERLOGIN, TUSERREGISTER, TVERIFYUSER } from "../../types";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { db } from "../../database/db";
import { ACESSTOKENCOOKIEOPTIONS, BADREQUESTCODE, REFRESHTOKENCOOKIEOPTIONS, SUCCESSCODE } from "../../constants";
import { passwordHasher, verifyPassword } from "../../services/passwordHasherService";
import tokenGeneratorService from "../../services/tokenGeneratorService";
import { generateOtp } from "../../services/slugStringGeneratorService";
import { sendOTP } from "../../services/sendOTPService";

let payLoad: TPAYLOAD = { uid: "", tokenVersion: 0 };
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
    const generateOneTimePassword = generateOtp();
    const hashedOTPPassword = (await passwordHasher(generateOneTimePassword.otp, res)) as string;

    await db.user.create({
      data: {
        username: username.toLowerCase(),
        fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "CLIENT",
        otpPassword: hashedOTPPassword,
        otpPasswordExpiry: generateOneTimePassword.otpExpiry
      }
    });
    await sendOTP(email, generateOneTimePassword.otp, fullName);
    httpResponse(req, res, SUCCESSCODE, "Please verify your email wit 6 digit OTP sent to your email", { fullName, email });
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
    payLoad = { uid: user?.uid, tokenVersion: user?.tokenVersion };
    const accessToken = generateAccessToken(payLoad, res, "14m");
    const refreshToken = generateRefreshToken(payLoad, res, "7d");
    res.cookie("refreshToken", refreshToken, REFRESHTOKENCOOKIEOPTIONS).cookie("accessToken", accessToken, ACESSTOKENCOOKIEOPTIONS);
    httpResponse(req, res, SUCCESSCODE, "User logged in successfully", { email, refreshToken, accessToken });
  }),
  // ********* VERIFY USER WITH OTP ***************
  verifyUser: asyncHandler(async (req: Request, res: Response) => {
    // validation is already handled by the middleware
    const { email, OTP } = req.body as TVERIFYUSER;
    const user = await db.user.findUnique({ where: { email: email } });
    if (!user) throw { status: BADREQUESTCODE, message: "Invalid email" };

    if (user.otpPasswordExpiry && user.otpPasswordExpiry < new Date()) {
      await db.user.update({
        where: { email: email.toLowerCase() },
        data: {
          otpPassword: null,
          otpPasswordExpiry: null
        }
      });
      throw { status: BADREQUESTCODE, message: "OTP expired. Please try again" };
    }
    const isPasswordMatch = await verifyPassword(OTP, user?.otpPassword as string, res);
    if (!isPasswordMatch) throw { status: BADREQUESTCODE, message: "Invalid OTP" };

    await db.user.update({
      where: { email: email.toLowerCase() },
      data: {
        emailVerifiedAt: new Date(),
        otpPassword: null,
        otpPasswordExpiry: null
      }
    });
    const { generateAccessToken, generateRefreshToken } = tokenGeneratorService;

    payLoad = { uid: user?.uid, tokenVersion: user?.tokenVersion };
    const accessToken = generateAccessToken(payLoad, res, "14m");
    const refreshToken = generateRefreshToken(payLoad, res, "7d");
    res.cookie("refreshToken", refreshToken, REFRESHTOKENCOOKIEOPTIONS).cookie("accessToken", accessToken, ACESSTOKENCOOKIEOPTIONS);
    httpResponse(req, res, SUCCESSCODE, "User verified  successfully", { email, refreshToken, accessToken });
  }),
  // ********** Send OTP controller *******************8
  sendOTP: asyncHandler(async (req: Request, res: Response) => {
    // validation is already handled by middleware
    const { email } = req.body as TSENDOTP;
    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw { status: BADREQUESTCODE, message: "Invalid email" };
    if (user.emailVerifiedAt) throw { status: BADREQUESTCODE, message: "Email already verified" };
    const generateOneTimePassword = generateOtp();
    const hashedOTPPassword = (await passwordHasher(generateOneTimePassword.otp, res)) as string;
    await db.user.update({
      where: { email: email.toLowerCase() },
      data: {
        otpPassword: hashedOTPPassword,
        otpPasswordExpiry: generateOneTimePassword.otpExpiry
      }
    });
    await sendOTP(email, generateOneTimePassword.otp, user.fullName);
    httpResponse(req, res, SUCCESSCODE, "OTP sent successfully", { email });
  })
};
