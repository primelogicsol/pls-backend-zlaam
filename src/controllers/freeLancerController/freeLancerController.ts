import { ADMIN_MAIL_1 } from "../../config/config";
import {
  ADMINNAME,
  BADREQUESTCODE,
  COMPANY_NAME,
  NOTFOUNDCODE,
  NOTFOUNDMSG,
  SUCCESSCODE,
  SUCCESSMSG,
  THANKYOUMESSAGE,
  WELCOMEMESSAGEFORFREELANCER
} from "../../constants";
import { generateUsername } from "../../services/slugStringGeneratorService";
import { db } from "../../database/db";
import type { _Request } from "../../middlewares/authMiddleware";
import { gloabalEmailMessage } from "../../services/gloablEmailMessageService";
import { passwordHasher } from "../../services/passwordHasherService";
import { generateRandomStrings } from "../../services/slugStringGeneratorService";
import type { TFREELANCER } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  // ** Freelancer will request for create an account
  getFreeLancerJoinUsRequest: asyncHandler(async (req, res) => {
    const freeLancer = req.body as TFREELANCER;
    const isExist = await db.freeLancersRequest.findUnique({
      where: {
        email: freeLancer.email,
        phone: freeLancer.phone
      }
    });
    if (isExist) throw { status: BADREQUESTCODE, message: "User Already exists with same email or phone" };
    await db.freeLancersRequest.create({
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
    const freelancers = await db.freeLancersRequest.findMany({
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
    const freelancer = await db.freeLancersRequest.findUnique({
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
    await db.freeLancersRequest.update({
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
    await db.freeLancersRequest.update({
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
    const isRequestExist = await db.freeLancersRequest.findUnique({ where: { id: Number(id) }, select: { id: true } });
    if (!isRequestExist) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    await db.freeLancersRequest.delete({
      where: {
        id: Number(id)
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  // ** Accept freelancer Request
  acceptFreeLancerRequest: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const isRequestExist = await db.freeLancersRequest.findUnique({ where: { id: Number(id) } });
    if (!isRequestExist) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    await db.freeLancersRequest.update({
      where: {
        id: Number(id)
      },
      data: {
        isAccepted: true
      }
    });
    const randomPassword = generateRandomStrings(6);
    const hashedPassword = (await passwordHasher(randomPassword, res)) as string;
    const isFreelancerAlreadyExist = await db.user.findUnique({
      where: {
        email: isRequestExist?.email
      }
    });
    if (isFreelancerAlreadyExist) {
      await db.user.update({
        where: {
          email: isRequestExist?.email
        },
        data: {
          role: "FREELANCER"
        }
      });
      return res
        .status(SUCCESSCODE)
        .json({ success: true, status: SUCCESSCODE, message: "As user already exists so its role changed to freelancer" })
        .end();
    }
    const createdFreelancer = await db.user.create({
      data: {
        username: `${generateUsername(isRequestExist.name)}_${generateRandomStrings(4)}`.toLowerCase(),
        email: isRequestExist.email,
        fullName: isRequestExist.name,
        role: "FREELANCER",
        phone: isRequestExist.phone,
        password: hashedPassword,
        emailVerifiedAt: new Date()
      }
    });
    await gloabalEmailMessage(
      ADMIN_MAIL_1,
      isRequestExist.email,
      ADMINNAME,
      `${WELCOMEMESSAGEFORFREELANCER} <p>Please use the following credintials to get access of your Dashboard from where you can see the list of all the projects.</p>
      <br>
      Username:<p style="color:blue;font-weight:bold;">${createdFreelancer.username}</p>
      Password:<p style="color:blue;font-weight:bold;">${randomPassword}</p>
      <p>Best Regard,</p> ${COMPANY_NAME}
`,
      `Congratulations For Joining Our Team`,
      `Dear, ${isRequestExist.name}`
    );
    await db.freeLancersRequest.delete({
      where: {
        id: Number(id)
      }
    });
    return res
      .status(SUCCESSCODE)
      .json({ success: true, status: SUCCESSCODE, message: "Request Accepted Successfully", createdFreelancer: createdFreelancer.uid })
      .end();
  }),
  // ** Create Niche for freelancer dynamically
  createNicheListForFreelancer: asyncHandler(async (req: _Request, res) => {
    const { niche } = req.body as TFREELANCER;
    if (!niche) throw { status: BADREQUESTCODE, message: "Niche is required" };
    await db.nichesForFreelancers.create({ data: { niche } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  // ** Delete Niche for freelancer

  deleteNicheForFreelancer: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    await db.nichesForFreelancers.delete({ where: { id: Number(id) } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  // ** List existing niches for freelancers

  listAllNichesForFreelancer: asyncHandler(async (req: _Request, res) => {
    const niches = await db.nichesForFreelancers.findMany();
    if (niches.length === 0) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, niches);
  }),
  // ** Update Niche for freelancer
  updateNicheForFreelancer: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const { niche } = req.body as TFREELANCER;
    await db.nichesForFreelancers.update({ where: { id: Number(id) }, data: { niche } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  }),
  // ** List single Niche for freelancer

  listSingleNicheForFreelancer: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    const niche = await db.nichesForFreelancers.findUnique({ where: { id: Number(id) } });
    if (!niche) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, niche);
  })
};
