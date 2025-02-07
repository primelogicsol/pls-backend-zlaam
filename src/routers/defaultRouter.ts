import { Router } from "express";
import endpoint from "../constants/endpoint";
import { authRouter } from "./authRouter/authRouter";
import { healthRouter } from "./healthRouter/healthRouter";
import { contactUsRouter } from "./contactUsRouter/contactUsRouter";
import { newsLetterRouter } from "./newsLetterRouter/newsLetterRouter";
import { trashRouter } from "./trashRouter/trashRouter";
import { navigationPagesRouter } from "./navigationPagesRouter/navigationPagesRouter";
import { getQuoteRouter } from "./getQuoteRouter/getQuoteRouter";
import { consultationRouter } from "./consultationRouter/consultationRouter";
import { hireUsRouter } from "./hireUsRouter/hireUsRouter";
import { freeLancerRouter } from "./freelancerRouter/freeLancerRouter";
import { projectRouter } from "./projectRouter/projectRouter";
import { blogRouter } from "./blogRouter/blogRouter";
export const defaultRouter: Router = Router();

defaultRouter.use(endpoint.AUTHROUTE, authRouter);
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
// **   BLOG  ROUTER
defaultRouter.use(endpoint.BLOG, blogRouter);
