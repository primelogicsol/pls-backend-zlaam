import { ADMIN_MAIL_1 } from "../../config/config";
import { BADREQUESTCODE, SUCCESSCODE, SUCCESSMSG, THANKYOUMESSAGE } from "../../constants";
import { db } from "../../database/db";
import { gloabalEmailMessage } from "../../services/gloablEmailMessageService";
import type { TFREELANCER } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getFreeLancerRequest: asyncHandler(async (req, res) => {
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
      freeLancer.name,
      THANKYOUMESSAGE,
      `Your Request To Join Our Team`,
      `Dear, ${freeLancer.name}`
    );
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG);
  })
};
