import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import type { TBLOGPOST } from "../../types";
import { db } from "../../database/db";
import { generateSlug } from "../../services/slugStringGeneratorService";
import { httpResponse } from "../../utils/apiResponseUtils";
import { BADREQUESTCODE, NOTFOUNDCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";

export default {
  //** Create Blog
  createBlog: asyncHandler(async (req: Request, res: Response) => {
    const { blogTitle, blogThumbnail, blogOverview, blogBody } = req.body as TBLOGPOST;
    // ** validation is handled by middleware
    const blogSlug = generateSlug(blogTitle);
    await db.blogPost.create({ data: { blogTitle, blogSlug, blogThumbnail, blogOverview, blogBody } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { optMessage: "Blog uploaded successfully" });
  }),
  // **  List Single Blog Post
  getSingleBlog: asyncHandler(async (req: Request, res: Response) => {
    const { blogSlug } = req.params;
    if (!blogSlug) throw { status: BADREQUESTCODE, message: "Blog slug is required" };
    const blog = await db.blogPost.findUnique({ where: { blogSlug } });
    if (!blog) throw { status: NOTFOUNDCODE, message: "Blog not found" };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, blog);
  }),

  // ** List All Public Blogs Blog Posts
  getAllPublicBlog: asyncHandler(async (req: Request, res: Response) => {
    const blogCache: Map<string, { blogs: TBLOGPOST[]; pagination: unknown }> = new Map();
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const cacheKey = `blogs_page_${page}_limit_${limit}`;
    if (blogCache.has(cacheKey)) {
      httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, blogCache.get(cacheKey));
    }
    const [blogs, totalBlogs] = await Promise.all([
      db.blogPost
        .findMany({
          where: { isPublished: true },
          skip: (page - 1) * limit,
          take: limit
        })
        .then((res) => {
          if (res.length === 0) throw { status: NOTFOUNDCODE, message: "There is no public blog for now" };
          return res;
        }),
      db.blogPost.count({
        where: { isPublished: true }
      })
    ]);
    const totalPages = Math.ceil(totalBlogs / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const pagination = {
      page,
      limit,
      totalPages,
      totalBlogs,
      hasNextPage,
      hasPreviousPage
    };
    const response = { blogs, pagination };
    blogCache.set(cacheKey, response);
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, response);
  }),

  // ** List all private Blogs
  getAllPrivateBlogs: asyncHandler(async (req: Request, res: Response) => {
    const blogs = await db.blogPost.findMany({ where: { isPublished: false } });
    if (blogs.length === 0) throw { status: NOTFOUNDCODE, message: "There is no private blog for now" };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, blogs);
  }),

  // ** Update Blog
  updateBlog: asyncHandler(async (req: Request, res: Response) => {
    const { blogSlug } = req.params;
    if (!blogSlug) throw { status: BADREQUESTCODE, message: "Blog slug is required" };
    const { blogTitle, blogThumbnail, blogOverview, blogBody, isPublished = true } = req.body as TBLOGPOST;
    const updatedBlog = await db.blogPost
      .update({ where: { blogSlug }, data: { blogTitle, blogThumbnail, blogOverview, blogBody, isPublished } })
      .catch(() => {
        throw { status: BADREQUESTCODE, message: "Blog not found" };
      });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { optMessage: "Blog updated successfully", updatedBlog });
  }),
  // ** Delete Blog
  deleteBlog: asyncHandler(async (req: Request, res: Response) => {
    const { blogSlug } = req.params;
    if (!blogSlug) throw { status: BADREQUESTCODE, message: "Blog slug is required" };
    await db.blogPost.delete({ where: { blogSlug } }).catch(() => {
      throw { status: NOTFOUNDCODE, message: "Blog not found" };
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { optMessage: "Blog deleted successfully" });
  }),
  // ** Make Blog public or Private
  makeBlogPublicOrPrivate: asyncHandler(async (req: Request, res: Response) => {
    const { blogSlug } = req.params;
    if (!blogSlug) throw { status: BADREQUESTCODE, message: "Blog slug is required" };
    const { isPublished = true } = req.body as TBLOGPOST;
    const updatedBlog = await db.blogPost.update({ where: { blogSlug }, data: { isPublished }, select: { isPublished: true } }).catch(() => {
      throw { status: NOTFOUNDCODE, message: "Blog not found" };
    });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { optMessage: "Blog updated successfully", updatedBlog });
  })
};
