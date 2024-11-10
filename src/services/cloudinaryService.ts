/* eslint-disable camelcase */
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "../config/config";
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resourcetype: "auto"
    });
    //file has been uploaded
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error: unknown) {
    fs.unlinkSync(localFilePath); //remove local file from local server.
    throw { status: 500, message: error };
  }
};
export { uploadOnCloudinary };
