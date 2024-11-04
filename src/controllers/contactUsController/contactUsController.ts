import { NOTFOUNDCODE, NOTFOUNDMSG, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { TCONTACTUS } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  contactUs: asyncHandler(async (req, res) => {
    // ** Validation is handled by middleware
    const { firstName, lastName, email, message } = req.body as TCONTACTUS;
    await db.contactUs.create({
      data: {
        firstName,
        lastName,
        email,
        message
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { firstName, lastName, email, message });
  }),

  getAllMessages: asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [messages, totalMessages] = await Promise.all([
      db.contactUs.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc"
        }
      }),
      db.contactUs.count()
    ]);

    const totalPages = Math.ceil(totalMessages / limit);

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, {
      page,
      totalPages,
      limit,
      totalMessages,
      messages
    });
  }),
  deleteMessage: asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Attempt to delete the message
    const deletedMessage = await db.contactUs.delete({
      where: {
        id: Number(id)
      }
    });

    if (!deletedMessage) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    else {
      httpResponse(req, res, SUCCESSCODE, "Message deleted successfully", deletedMessage);
    }
  }),
  getSingleMessage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const message = await db.contactUs.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!message) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    else {
      httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, message);
    }
  })
};
