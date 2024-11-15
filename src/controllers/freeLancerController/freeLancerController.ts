import { ADMIN_MAIL_1 } from "../../config/config";
import { ADMINNAME, BADREQUESTCODE, NOTFOUNDCODE, NOTFOUNDMSG, SUCCESSCODE, SUCCESSMSG, THANKYOUMESSAGE } from "../../constants";
import { db } from "../../database/db";
import type { _Request } from "../../middlewares/authMiddleware";
import { gloabalEmailMessage } from "../../services/gloablEmailMessageService";
import type { TFREELANCER } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  // ** Freelancer will request for create an account
  getFreeLancerJoinUsRequest: asyncHandler(async (req, res) => {
    const freeLancer = req.body as TFREELANCER;
    const isExist = await db.freeLancers.findUnique({
      where: {
        email: freeLancer.email,
        phone: freeLancer.phone
      }
    });
    if (isExist) throw { status: BADREQUESTCODE, message: "User Already exists with same email or phone" };
    await db.freeLancers.create({
      data: freeLancer
    });
    await gloabalEmailMessage(
      ADMIN_MAIL_1,
      freeLancer.email,
      ADMINNAME,
      THANKYOUMESSAGE,
      `Your Request To Join Our Team`,
      `Dear, ${freeLancer.name}`
    );
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  //  ** Get all freelancer Request which are unaccepted
  getAllFreeLancerRequest: asyncHandler(async (req, res) => {
    const freelancers = await db.freeLancers.findMany({
      where: {
        trashedAt: null,
        trashedBy: null,
        isAccepted: false
      }
    });
    if (freelancers.length === 0) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, freelancers);
  }),
  // ** Get Single freelancer Request which are unaccepted
  getSingleFreeLancerRequest: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const freelancer = await db.freeLancers.findUnique({
      where: {
        id: Number(id),
        trashedAt: null,
        trashedBy: null
      }
    });
    if (!freelancer) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, freelancer);
  }),

  // ** Trash Freelancer Requst
  trashFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const uid = req.userFromToken?.uid as string;

    const userWhoTrashed = await db.user.findUnique({ where: { uid: uid } });
    if (!userWhoTrashed) throw { status: BADREQUESTCODE, message: "User not found" };
    await db.freeLancers.update({
      where: {
        id: Number(id)
      },
      data: {
        trashedBy: `@${userWhoTrashed.username}-${userWhoTrashed.fullName}-${userWhoTrashed.role}`,
        trashedAt: new Date()
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  // ** untrash freelancer Join request
  untrashFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    await db.freeLancers.update({
      where: {
        id: Number(id)
      },
      data: {
        trashedBy: null,
        trashedAt: null
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  // ** Permanently delete the request
  deleteFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const isRequestExist = await db.freeLancers.findUnique({ where: { id: Number(id) }, select: { id: true } });
    if (!isRequestExist) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    await db.freeLancers.delete({
      where: {
        id: Number(id)
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  // ** Accept freelancer Request
  acceptFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const isRequestExist = await db.freeLancers.findUnique({ where: { id: Number(id) }, select: { id: true } });
    if (!isRequestExist) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    await db.freeLancers.update({
      where: {
        id: Number(id)
      },
      data: {
        isAccepted: true
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  })
};
