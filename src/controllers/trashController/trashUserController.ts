import { NOTFOUNDCODE, NOTFOUNDMSG } from "../../constants";
import { db } from "../../database/db";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getTrashedUsers: asyncHandler(async (req, res) => {
    const trashedUsers = await db.user.findMany({
      where: {
        trashedBy: { not: null },
        trashedAt: { not: null }
      },
      select: {
        uid: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        trashedBy: true,
        trashedAt: true,
        createdAt: true
      }
    });
    if (trashedUsers.length === 0) throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    httpResponse(req, res, 200, "Data fetched successfully", trashedUsers);
  })
};
