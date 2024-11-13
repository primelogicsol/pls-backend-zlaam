import { NOTFOUNDCODE, NOTFOUNDMSG } from "../../constants";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getTrashedQuotes: asyncHandler(async (req, res) => {
    const trashedQuotes = await db.getQuote.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      }
    });
    if (trashedQuotes.length === 0) {
      throw {
        status: NOTFOUNDCODE,
        message: NOTFOUNDMSG
      };
    }
    httpResponse(req, res, 200, "Data fetched successfully", trashedQuotes);
  })
};
