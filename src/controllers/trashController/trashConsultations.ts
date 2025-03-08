import { NOTFOUNDMSG, SUCCESSCODE } from "../../constants";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getAllTrashedConsultations: asyncHandler(async (req, res) => {
    const trashedConsultations = await db.consultationBooking.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      }
    });
    if (trashedConsultations.length === 0) {
      httpResponse(req, res, SUCCESSCODE, NOTFOUNDMSG, null);
    }
    httpResponse(req, res, 200, "Data fetched successfully", trashedConsultations);
  })
};
