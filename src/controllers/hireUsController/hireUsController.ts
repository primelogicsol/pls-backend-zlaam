import { uploadOnCloudinary } from "../../services/cloudinaryService";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import logger from "../../utils/loggerUtils";

export default {
  hireUs: asyncHandler(async (req, res) => {
    req.files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!req.files?.doc1) throw { status: 400, message: "No file uploaded" };
    const doc1: string | undefined = req.files.doc1[0]?.path;
    logger.info(doc1);
    if (!doc1) throw { status: 400, message: "No file uploaded" };
    await uploadOnCloudinary(doc1);
    res.json({ doc1 });
  })
};
