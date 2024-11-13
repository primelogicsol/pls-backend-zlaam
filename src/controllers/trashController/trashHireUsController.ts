import { NOTFOUNDCODE, NOTFOUNDMSG } from "../../constants";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getAllTrashedHireUs: asyncHandler(async (req, res) => {
    const trashedHireUs = await db.hireUs.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      }
    });
    if (trashedHireUs.length === 0) {
      throw {
        status: NOTFOUNDCODE,
        message: NOTFOUNDMSG
      };
    }
    httpResponse(req, res, 200, "Data fetched successfully", trashedHireUs);
  })
};
