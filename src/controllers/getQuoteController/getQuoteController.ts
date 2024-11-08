import { BADREQUESTCODE, BADREQUESTMSG, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { _Request } from "../../middlewares/authMiddleware";
import type { TGETQUOTE, TSERVICESFORQUOTE } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  // **   create quote controller
  createQuote: asyncHandler(async (req, res) => {
    const { name, email, phone, company, address, deadline, detail, services } = req.body as TGETQUOTE;

    const data: TGETQUOTE = {
      name,
      email,
      phone,
      address,
      services,
      // Optional fields
      company: company ?? "",
      detail: detail ?? "",
      deadline: deadline || ""
    };
    await db.getQuote.create({ data });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, data);
  }),
  // **  create services for quote controlller
  createServicesForQuote: asyncHandler(async (req, res) => {
    const { services } = req.body as TSERVICESFORQUOTE;
    if (!services) throw { status: BADREQUESTCODE, message: BADREQUESTMSG };
    await db.createServicesForQuote.create({ data: { services } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { services });
  }),
  // ** fetch single quote controller
  getSingleQuote: asyncHandler(async (req, res) => {
    const quote = await db.getQuote.findUnique({ where: { id: Number(req.params.id), trashedBy: null, trashedAt: null } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, quote);
  }),
  // ** fetch all qotes controller
  getAllQuote: asyncHandler(async (req, res) => {
    const quotes = await db.getQuote.findMany({ where: { trashedAt: null, trashedBy: null } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, quotes);
  }),
  // ** Trash single quote controller
  trashQuote: asyncHandler(async (req: _Request, res) => {
    const uid = req.userFromToken?.uid;
    if (!uid) throw { status: BADREQUESTCODE, message: BADREQUESTMSG };
    const quote = await db.getQuote.update({ where: { id: Number(req.params.id) }, data: { trashedBy: uid, trashedAt: new Date() } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, quote);
  }),
  // ** Untrash Single controller
  unTrashQuote: asyncHandler(async (req: _Request, res) => {
    const quote = await db.getQuote.update({ where: { id: Number(req.params.id) }, data: { trashedBy: null, trashedAt: null } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, quote);
  }),
  // ** Delete Single controller
  deleteQuote: asyncHandler(async (req: _Request, res) => {
    const quote = await db.getQuote.delete({ where: { id: Number(req.params.id) } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, quote);
  })
};
