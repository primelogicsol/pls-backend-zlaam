import { NOTFOUNDCODE, NOTFOUNDMSG } from "../../constants";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  trashedNavigationPages: asyncHandler(async (req, res) => {
    const trashedPages = await db.menuItem.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      }
    });

    if (trashedPages.length === 0) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, 200, "Data fetched successfully", trashedPages);
  })
};
