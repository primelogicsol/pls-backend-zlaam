import type { UploadApiResponse } from "cloudinary";
import { uploadOnCloudinary } from "../../services/cloudinaryService";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { BADREQUESTCODE } from "../../constants";

export default {
  hireUs: asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw { status: BADREQUESTCODE, message: "At least one file is required." };
    }
    const uploadFile = async (file: Express.Multer.File): Promise<UploadApiResponse | null> => {
      const localPath = file.path;
      const fileType = file.mimetype.split("/").at(-1) as string;

      if (fileType !== "pdf") {
        throw { status: BADREQUESTCODE, message: "Only PDF files are allowed" };
      }

      return await uploadOnCloudinary(localPath, file.filename, fileType);
    };

    const uploadResponses = await Promise.all(files.map(uploadFile));

    const responseData = uploadResponses.map((response) => ({
      name: response?.original_filename,
      url: response?.secure_url
    }));

    res.json({
      success: true,
      message: "Files uploaded successfully",
      data: responseData
    });
  })
};
