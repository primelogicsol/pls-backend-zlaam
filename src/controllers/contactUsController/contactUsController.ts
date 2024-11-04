import { BADREQUESTCODE, NOTFOUNDCODE, NOTFOUNDMSG, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import { sendMessageToTheUserService } from "../../services/sendMessageToUserService";
import type { TCONTACTUS } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  // create message controller
  createMessage: asyncHandler(async (req, res) => {
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
  // ** get all message controller
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
  // delete message controller
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

  // get Single message controller
  getSingleMessage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Id is required!" };
    const message = await db.contactUs.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!message) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    else {
      httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, message);
    }
  }),

  sendMessageToUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Id is required!" };
    const { message: messageByAdmin } = req.body as TCONTACTUS;
    // ** validation is already handled by middleware
    const message = await db.contactUs.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!message) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    await sendMessageToTheUserService(message.email, messageByAdmin, `${message.firstName} ${message.lastName}`);
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { messageByAdmin, message: `Replied to this message: ${message.message}` });
  })
};
