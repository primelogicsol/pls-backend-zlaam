import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  trashedNavigationPages: asyncHandler(async (req, res) => {
    const trashedPages = await db.navigationPages.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      }
    });
    httpResponse(req, res, 200, "Data fetched successfully", trashedPages);
  })
};
