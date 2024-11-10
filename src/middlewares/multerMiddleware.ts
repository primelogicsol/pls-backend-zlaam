import multer from "multer";
import type { Request, Response, NextFunction } from "express";
import { BADREQUESTCODE, BADREQUESTMSG } from "../constants";
import { asyncHandler } from "../utils/asyncHandlerUtils";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "./public/temp");
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5
  }
}).array("documents", 5);

export const fileUploadMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      throw { status: BADREQUESTCODE, message: err.message || BADREQUESTMSG };
    } else {
      if (err instanceof Error) {
        throw { status: BADREQUESTCODE, message: err.message || BADREQUESTMSG };
      }
      if (err) {
        throw { status: BADREQUESTCODE, message: `${err as string}` };
      }
    }
    if (!req.files || (req.files as Express.Multer.File[]).length < 1) {
      throw { status: BADREQUESTCODE, message: "At least 1 file is required!!" };
    }

    return next();
  });
});
