import { NOTFOUNDCODE, NOTFOUNDMSG } from "../../constants";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getTrashedContactUs: asyncHandler(async (req, res) => {
    const trashedContactUs = await db.hireUs.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      }
    });
    if (trashedContactUs.length === 0) {
      throw {
        status: NOTFOUNDCODE,
        message: NOTFOUNDMSG
      };
    }
    httpResponse(req, res, 200, "Data fetched successfully", trashedContactUs);
  })
};
