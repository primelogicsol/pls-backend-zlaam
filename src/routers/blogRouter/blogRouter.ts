import { Router } from "express";
import blogController from "../../controllers/blogController/blogController";
import { validateDataMiddleware } from "../../middlewares/validationMiddleware";
import { blogPostSchema } from "../../validation/zod";
import authMiddleware from "../../middlewares/authMiddleware";
export const blogRouter: Router = Router();
blogRouter.route("/createBlog").post(validateDataMiddleware(blogPostSchema), authMiddleware.checkIfUserIAdminOrModerator, blogController.createBlog);
blogRouter.route("/getSingleBlog/:blogSlug").get(blogController.getSingleBlog);
blogRouter.route("/getAllPublicBlogs").get(blogController.getAllPublicBlog);
blogRouter.route("/getAllPrivateBlogs").get(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, blogController.getAllPrivateBlogs);
blogRouter
  .route("/updateBlog/:blogSlug")
  .patch(validateDataMiddleware(blogPostSchema), authMiddleware.checkToken, authMiddleware.checkIfUserIAdminOrModerator, blogController.updateBlog);
blogRouter
  .route("/makeBlogPublicOrPrivate/:blogSlug")
  .patch(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, blogController.makeBlogPublicOrPrivate);
blogRouter.route("/deleteBlog/:blogSlug").delete(authMiddleware.checkToken, authMiddleware.checkIfUserIsAdmin, blogController.deleteBlog);
