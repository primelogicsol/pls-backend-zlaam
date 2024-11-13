import { NOTFOUNDCODE, NOTFOUNDMSG } from "../../constants";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getAllTrashedConsultations: asyncHandler(async (req, res) => {
    const trashedConsultations = await db.hireUs.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      }
    });
    if (!trashedConsultations) {
      throw {
        status: NOTFOUNDCODE,
        message: NOTFOUNDMSG
      };
    }
    httpResponse(req, res, 200, "Data fetched successfully", trashedConsultations);
  })
};
