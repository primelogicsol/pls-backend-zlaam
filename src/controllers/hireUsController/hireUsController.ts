import type { UploadApiResponse } from "cloudinary";
import { uploadOnCloudinary } from "../../services/cloudinaryService";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { ADMINNAME, BADREQUESTCODE, HIREUSMESSAGE, NOTFOUNDCODE, NOTFOUNDMSG, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import type { THIREUS } from "../../types";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { gloabalEmailMessage } from "../../services/gloablEmailMessageService";
import { ADMIN_MAIL_1 } from "../../config/config";
import type { _Request } from "../../middlewares/authMiddleware";

export default {
  // create hire us request controller
  createHireUsRequest: asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    // ** validation for this data is already handled in  middleware
    const data = req.body as THIREUS;
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

    const responseAfterUploadingFilesOnCloudinary = uploadResponses.map((response) => ({
      name: response?.original_filename,
      url: response?.secure_url
    }));
    const createdHireUs = await db.hireUs.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        detail: data.detail,
        address: data.address,
        company: data.company,
        docs: responseAfterUploadingFilesOnCloudinary
      }
    });
    await gloabalEmailMessage(ADMIN_MAIL_1, data.email, ADMINNAME, HIREUSMESSAGE, "Request to hire Prime Logic Solution", `Dear ${data.name}`);
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { data: createdHireUs });
  }),

  // **  get All the hire us request
  getAllHireUsRequests: asyncHandler(async (req, res) => {
    const hireUs = await db.hireUs.findMany({ where: { trashedAt: null, trashedBy: null } });
    if (hireUs.length === 0) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { data: hireUs });
  }),

  // ** get Single hire us request
  getSingleHireUsRequest: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const hireUs = await db.hireUs.findUnique({ where: { id: Number(id) } });
    if (!hireUs) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { data: hireUs });
  }),
  // ** trash hire us request
  trashHireUsRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const user = await db.user.findUnique({ where: { uid: req.userFromToken?.uid || "" } });
    const hireUs = await db.hireUs.update({
      where: { id: Number(id) },
      data: { trashedAt: new Date(), trashedBy: `@${user?.username}-${user?.fullName}-${user?.role}` }
    });
    if (!hireUs) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { data: hireUs });
  }),
  // ** untrash hir us request
  untrashHireUsRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const hireUs = await db.hireUs.update({ where: { id: Number(id) }, data: { trashedAt: null, trashedBy: null } });
    if (!hireUs) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { data: hireUs });
  }),
  // ** permanent delete hire us request
  permanentDeleteHireUsRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const hireUs = await db.hireUs.delete({ where: { id: Number(id) } });
    if (!hireUs) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  })
};
