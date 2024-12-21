import { db } from "../../database/db";
import type { IMENUITEM } from "../../types";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { httpResponse } from "../../utils/apiResponseUtils";
import { BADREQUESTCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import type { _Request } from "../../middlewares/authMiddleware";
import { generateRandomStrings, generateSlug } from "../../services/slugStringGeneratorService";

const createMenuItem = async (item: IMENUITEM, parentId: number | null = null): Promise<void> => {
  const slug = generateSlug(item.title);
  const existingItem = await db.menuItem.findUnique({ where: { slug } });
  if (existingItem) throw { BADREQUESTCODE, message: `Navigation page with title ${item.title} already exists` };
  const createdItem = await db.menuItem.create({
    data: {
      title: item.title,
      description: item.description ?? null,
      href: item.href ?? null,
      image: item.image ?? null,
      slug: `${slug}_${generateRandomStrings(5)}`,
      parentId
    }
  });

  if (item.children && item.children.length > 0) {
    for (const child of item.children) {
      await createMenuItem(child, createdItem.id);
    }
  }
};

export default {
  // ** Create navigation page controller
  createNavigationPage: asyncHandler(async (req, res) => {
    const data = req.body as IMENUITEM;
    if (!data.title) throw { status: 400, message: "Navigation page title is required" };

    await createMenuItem(data);
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { message: "Navigation page created successfully" });
  }),

  // ** Get Single navigation page controller
  getSingleNavigationPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page ID is required" };

    const menuItem = await db.menuItem.findUnique({
      where: { id: Number(id) },
      include: { children: true }
    });

    if (!menuItem) throw { status: 404, message: "Navigation page not found" };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, menuItem);
  }),

  // ** Get All navigation pages controller
  getAllNavigationPages: asyncHandler(async (req, res) => {
    const menuItems = await db.menuItem.findMany({
      where: { trashedAt: null },
      include: { children: true }
    });

    if (!menuItems || menuItems.length === 0) throw { status: 404, message: "No navigation pages found" };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, menuItems);
  }),

  // ** Update navigation page controller
  updateNavigationPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body as IMENUITEM;

    if (!id) throw { status: 400, message: "Navigation page ID is required" };
    if (!data) throw { status: 400, message: "Navigation page data is required" };
    if (typeof data !== "object") throw { status: 400, message: "Data must be an object" };

    const updatedMenuItem = await db.menuItem.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        description: data.description ?? null,
        href: data.href ?? null,
        image: data.image ?? null
      }
    });

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, updatedMenuItem);
  }),

  // ** Delete navigation page controller
  deleteNavigationPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page ID is required" };

    await db.menuItem.delete({ where: { id: Number(id) } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { message: "Navigation page deleted successfully" });
  }),

  // ** Trash navigation page controller
  trashNavigationPage: asyncHandler(async (req: _Request, res) => {
    const uid = req.userFromToken?.uid;
    const { id } = req.params;

    if (!id) throw { status: 400, message: "Navigation page ID is required" };
    if (!uid) throw { status: 400, message: "User ID is required" };

    const user = await db.user.findUnique({ where: { uid, trashedAt: null } });
    if (!user) throw { status: 404, message: "User not found" };

    const trashedMenuItem = await db.menuItem.update({
      where: { id: Number(id) },
      data: { trashedBy: `@${user.username}-${user.fullName}-${user.role}`, trashedAt: new Date() }
    });

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, trashedMenuItem);
  }),

  // ** Untrash navigation page controller
  untrashNavigationPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: 400, message: "Navigation page ID is required" };

    const untrashedMenuItem = await db.menuItem.update({
      where: { id: Number(id) },
      data: { trashedBy: null, trashedAt: null }
    });

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, untrashedMenuItem);
  }),
  addChildrenToMenuItem: asyncHandler(async (req, res) => {
    const { id } = req.params; // Parent MenuItem ID
    const children = req.body as IMENUITEM | IMENUITEM[]; // Single or multiple children

    if (!id) throw { status: 400, message: "Parent menu item ID is required" };
    if (!children) throw { status: 400, message: "Children data is required" };
    const parentMenuItem = await db.menuItem.findUnique({ where: { id: Number(id) } });
    if (!parentMenuItem) throw { status: 400, message: "Parent menu item does not exist" };

    // Ensure children are processed as an array
    const childrenArray = Array.isArray(children) ? children : [children];

    // Validate and set parentId for each child
    const processedChildren = childrenArray.map((child) => {
      if (!child.title) throw { status: 400, message: "Child title is required" };
      return {
        ...child,
        parentId: Number(id), // Explicitly set parentId
        slug: `${generateSlug(child.title)}-${Math.random().toString(36).substring(2, 8)}` // Ensure unique slug
      };
    });

    // Add the children to the parent MenuItem
    for (const child of processedChildren) {
      await db.menuItem.create({
        data: {
          title: child.title,
          description: child.description ?? null,
          href: child.href ?? null,
          image: child.image ?? null,
          slug: `${generateSlug(child.title)}_${generateRandomStrings(5)}`,
          parentId: child.parentId // Ensure the relation works
        }
      });
    }

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { message: "Children added successfully" });
  })
};
