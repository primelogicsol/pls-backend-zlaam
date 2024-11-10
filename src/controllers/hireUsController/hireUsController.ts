import type { UploadApiResponse } from "cloudinary";
import { uploadOnCloudinary } from "../../services/cloudinaryService";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  hireUs: asyncHandler(async (req, res) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files.doc1) throw { status: 400, message: "No file uploaded" };

    const doc1LocalPath: string | undefined = files.doc1[0]?.path;
    if (!doc1LocalPath) throw { status: 400, message: "No file found in temp folder" };
    const fileType = files.doc1[0]?.mimetype.split("/").at(-1) as string;
    /*  * validate if files are pdf or not */
    if (fileType !== "pdf") throw { status: 400, message: "Only pdf files are allowed" };
    const fileName = files.doc1[0]?.filename as string;
    const response: UploadApiResponse | null = await uploadOnCloudinary(doc1LocalPath, fileName, fileType);

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        name: response?.original_filename,
        url: response?.secure_url
      }
    });
  })
};
