import { BADREQUESTCODE, SUCCESSCODE, WHITELISTMAILS } from "../../constants";
import { db } from "../../database/db";
import { gloabalMailMessage } from "../../services/globalMailService";
import { sendNewsLetterToSubscribers } from "../../services/sendNewsLetterToSubscribersService";
import type { TSUBSCRIBENEWSLETTER } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  subscribeToTheNewsLetter: asyncHandler(async (req, res) => {
    // ** validation is already handled by  middleware
    const { email } = req.body as TSUBSCRIBENEWSLETTER;
    const isSubscribed = await db.newsletter.findUnique({ where: { email: email.toLowerCase() } });

    if (!isSubscribed) {
      await db.newsletter.create({
        data: {
          email: email.toLowerCase()
        }
      });
    }
    if (isSubscribed?.subscriptionStatus) throw { status: BADREQUESTCODE, message: "You have are already subscribed" };
    if (!isSubscribed?.subscriptionStatus) {
      await db.newsletter.update({ where: { email: email.toLowerCase() }, data: { subscriptionStatus: true } });
    }
    httpResponse(req, res, SUCCESSCODE, "You have  subscribed to our newsletter", { email, isSubscribed: true });
  }),
  // *** unsubscribed to the news letter

  unsubscribedFromNewsLetter: asyncHandler(async (req, res) => {
    // ** validation is already handled by  middleware
    const { email } = req.body as TSUBSCRIBENEWSLETTER;
    const isSubscribed = await db.newsletter.findUnique({ where: { subscriptionStatus: true, email: email.toLowerCase() } });
    if (!isSubscribed) throw { status: BADREQUESTCODE, message: "You are not subscribed" };
    await db.newsletter.update({ where: { email: email.toLowerCase() }, data: { subscriptionStatus: false } });
    httpResponse(req, res, SUCCESSCODE, "You have unsubscribed from our newsletter");
  }),
  // ** Send News Letter to single subscriber

  sendNewsLetterToSingleSubscriber: asyncHandler(async (req, res) => {
    // ** validation is already handled by  middleware
    const { email, newsLetter } = req.body as TSUBSCRIBENEWSLETTER;
    const isSubscribed = await db.newsletter.findUnique({ where: { email: email.toLowerCase(), subscriptionStatus: true } });
    if (WHITELISTMAILS.includes(email)) throw { status: BADREQUESTCODE, message: "Cannot send newsletter to admin" };
    if (!isSubscribed) throw { status: BADREQUESTCODE, message: "You are not subscribed" };
    await sendNewsLetterToSubscribers(email, newsLetter);
    httpResponse(req, res, SUCCESSCODE, "News letter sent successfully");
  }),
  sendNewsLetterToAllSubscribers: asyncHandler(async (req, res) => {
    // ** validation is already handled by  middleware
    const { newsLetter } = req.body as TSUBSCRIBENEWSLETTER;
    const allSubscribers = await db.newsletter.findMany({ where: { subscriptionStatus: true } });
    await Promise.all(
      allSubscribers.map((subscriber) => gloabalMailMessage(subscriber.email, newsLetter, "Prime Logic Solutions", `Dear ${subscriber.email}`))
    );
    httpResponse(req, res, SUCCESSCODE, "News letter sent successfully");
  }),
  listAllSubscribedMails: asyncHandler(async (req, res) => {
    // ** Add pagination

    const { page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    if (isNaN(pageNumber) || isNaN(pageLimit) || pageNumber <= 0 || pageLimit <= 0) {
      throw { status: 400, message: "Invalid pagination parameters!!" };
    }

    const skip = (pageNumber - 1) * pageLimit;
    const take = pageLimit;
    const allSubscribers = await db.newsletter.findMany({
      select: { email: true },
      skip,
      take,
      orderBy: {
        createdAt: "asc"
      }
    });
    httpResponse(req, res, SUCCESSCODE, "Subscribed Mails", allSubscribers);
  })
};
