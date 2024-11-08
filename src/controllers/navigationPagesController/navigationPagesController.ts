import { db } from "../../database/db";
import type { TNAVIGATIONPAGE } from "../../types";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { httpResponse } from "../../utils/apiResponseUtils";
import { SUCCESSCODE, SUCCESSMSG } from "../../constants";
import type { _Request } from "../../middlewares/authMiddleware";

export default {
  // ** Create navigation page controller
  createNavigationPage: asyncHandler(async (req, res) => {
    const { data } = req.body as TNAVIGATIONPAGE;
    if (!data) throw { status: 400, message: " data is required" };
    if (typeof data !== "object") throw { status: 400, message: " data must be an object" };
    await db.navigationPages.create({
      data: {
        navigationPageConfig: [data]
      }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, data);
  }),

  // ** Get Single navigation page controller
  getSingleNavigationPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page id is required" };
    const navigationPage = await db.navigationPages.findUnique({ where: { id: Number(id), trashedAt: null } });
    if (!navigationPage) throw { status: 404, message: "Navigation page not found" };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, navigationPage);
  }),

  // ** Get All navigation pages controller
  getAllNavigationPages: asyncHandler(async (req, res) => {
    const navigationPages = await db.navigationPages.findMany({ where: { trashedAt: null } });
    if (!navigationPages) throw { status: 404, message: "Navigation pages not found" };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, navigationPages);
  }),

  // ** update navigation page controller
  updateNavigationPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page id is required" };
    const { data } = req.body as TNAVIGATIONPAGE;
    if (!data) throw { status: 400, message: "Navigation page data is required" };

    if (typeof data !== "object") throw { status: 400, message: " data must be an object" };
    const navigationPage = await db.navigationPages.update({ where: { id: Number(id) }, data: { navigationPageConfig: [data] } });
    if (!navigationPage) throw { status: 404, message: "Navigation page not found" };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, navigationPage);
  }),

  // ** delete navigation page controller
  deleteNavigationPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page id is required" };
    await db.navigationPages
      .delete({ where: { id: Number(id) } })
      .then(() => httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, {}))
      .catch(() => httpResponse(req, res, 404, "Navigation page not found", {}));
  }),

  // ** trash navigation page controller
  trashNavigationPage: asyncHandler(async (req: _Request, res) => {
    const uid = req.userFromToken?.uid;
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page id is required" };
    if (!uid) throw { status: 400, message: "User id is required" };
    const user = await db.user.findUnique({ where: { uid, trashedAt: null } });
    if (!user) throw { status: 404, message: "User not found" };
    const navigationPage = await db.navigationPages.update({
      where: { id: Number(id) },
      data: { trashedBy: `@${user?.username}-${user?.fullName}-${user?.role}`, trashedAt: new Date() }
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, navigationPage);
  }),

  // ** untrashNavigationPages
  untrashNavigationPage: asyncHandler(async (req: _Request, res) => {
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page id is required" };
    const navigationPage = await db.navigationPages.update({ where: { id: Number(id) }, data: { trashedBy: null, trashedAt: null } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, navigationPage);
  })
};
