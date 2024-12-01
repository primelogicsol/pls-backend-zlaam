import { Router } from "express";
import blogController from "../../controllers/blogController/blogController";

export const blogRouter: Router = Router();
blogRouter.route("/createBlog").post(blogController.createBlog);
blogRouter.route("/getSingleBLog/:blogSlug ").get(blogController.getSingleBlog);
blogRouter.route("/getAllPublicBlog").get(blogController.getAllPublicBlog);
blogRouter.route("/updateBlog/:blogSlug").patch(blogController.updateBlog);
blogRouter.route("/makeBlogPublicOrPrivate/:blogSlug").patch(blogController.makeBlogPublicOrPrivate);
blogRouter.route("/deleteBlog/:blogSlug").delete(blogController.deleteBlog);
