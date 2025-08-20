import { Router } from "express";
import endpoint from "../constants/endpoint";
import { authRouter } from "./authRouter/authRouter";
import { blogRouter } from "./blogRouter/blogRouter";
import { consultationRouter } from "./consultationRouter/consultationRouter";
import { contactUsRouter } from "./contactUsRouter/contactUsRouter";
import { freeLancerRouter } from "./freelancerRouter/freeLancerRouter";
import { getQuoteRouter } from "./getQuoteRouter/getQuoteRouter";
import { healthRouter } from "./healthRouter/healthRouter";
import { hireUsRouter } from "./hireUsRouter/hireUsRouter";
import { milestoneRouter } from "./mileStoneRouter/mileStoneRouter";
import { navigationPagesRouter } from "./navigationPagesRouter/navigationPagesRouter";
import { newsLetterRouter } from "./newsLetterRouter/newsLetterRouter";
import projectRequestRouter from "./projectRequestRouter/projectRequestRouter";
import { projectRouter } from "./projectRouter/projectRouter";
import { trashRouter } from "./trashRouter/trashRouter";
export const defaultRouter: Router = Router();

defaultRouter.use(endpoint.AUTHROUTE, authRouter);
// **   Project Request
defaultRouter.use(endpoint.PROJECTREQUESTROUTE, projectRequestRouter);
// ** Health route
defaultRouter.use(endpoint.HEALTHROUTE, healthRouter);
// ** Contact Us Route
defaultRouter.use(endpoint.CONTACTUSROUTE, contactUsRouter);
// ** Newsletter Router
defaultRouter.use(endpoint.NEWSLETTERROUTE, newsLetterRouter);
// **  Trash Router
defaultRouter.use(endpoint.TRASHROUTE, trashRouter);
// ** Navigation Pages Router
defaultRouter.use(endpoint.NAVIGATIONPAGESROUTE, navigationPagesRouter);
// ** Get Quotes Router
defaultRouter.use(endpoint.GETQUOTESROUTE, getQuoteRouter);
// ** Consultation Router
defaultRouter.use(endpoint.CONSULTATIONROUTE, consultationRouter);
// **   HIRE US ROUTER
defaultRouter.use(endpoint.HIREUSROUTE, hireUsRouter);
// **   HIREUS  ROUTER
defaultRouter.use(endpoint.FREELANCER, freeLancerRouter);
// **   PROJECT  ROUTER
defaultRouter.use(endpoint.PROJECT, projectRouter);
// **   PROJECTMILESTONE ROUTER
defaultRouter.use(endpoint.MILESTONE, milestoneRouter);
// **   BLOG  ROUTER
defaultRouter.use(endpoint.BLOG, blogRouter);
