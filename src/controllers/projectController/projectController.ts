import { BADREQUESTCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { TSORTORDER, TFILTEREDPROJECT, TGETPROJECTSQUERY, TProject } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  createProject: asyncHandler(async (req, res) => {
    // ** validation is already handled by middleware
    const projectData = req.body as TProject;
    let deadline = projectData.deadline;

    if (deadline.length === 16) {
      deadline += ":00.000Z";
    } else {
      throw { status: BADREQUESTCODE, message: "Please enter a valid date" };
    }
    const newDeadLine = new Date(deadline);
    if (isNaN(newDeadLine.getTime())) {
      throw { status: BADREQUESTCODE, message: "Invalid date format." };
    }
    const isProjectAlreadyExist = await db.projects.findUnique({ where: { projectSlug: projectData.projectSlug, title: projectData.title } });
    if (isProjectAlreadyExist) {
      throw { status: BADREQUESTCODE, message: "Project already exist with same title." };
    }
    const createdProject = await db.projects.create({ data: { ...projectData, deadline: newDeadLine } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, createdProject);
  }),

  // ** Get Single Project By Slug
  getSingleProject: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.findUnique({ where: { projectSlug: projectSlug } });
    if (!project) throw { status: BADREQUESTCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, project);
  }),
  // **  Delete Project By Slug
  deleteProject: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.delete({ where: { projectSlug: projectSlug } });
    if (!project) throw { status: BADREQUESTCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, project);
  }),

  // ** Get All OutSourced Projects

  getAllProjects: asyncHandler(async (req, res) => {
    // Destructure and parse query parameters with types
    const {
      page = "1",
      limit = "10",
      difficultyLevel = "EASY",
      createdAtOrder = "latest",
      bountyOrder = "lowest",
      nicheName = ""
    }: TGETPROJECTSQUERY = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    const filters: TFILTEREDPROJECT = {
      trashedAt: null,
      trashedBy: null,
      projectType: "OUTSOURCE",
      projectStatus: "PENDING",
      niche: nicheName
    };

    if (difficultyLevel) {
      filters.difficultyLevel = difficultyLevel;
    }

    const orderBy: TSORTORDER[] = [];

    orderBy.push({
      createdAt: createdAtOrder ? "desc" : "asc"
    });

    orderBy.push({
      bounty: bountyOrder ? "desc" : "asc"
    });

    const projects = await db.projects.findMany({
      where: filters,
      skip,
      take: pageSize,
      orderBy: orderBy,
      select: {
        id: true,
        title: true,
        detail: true,
        deadline: true,
        bounty: true,
        progressPercentage: true,
        niche: true,
        dfficultyLevel: true,
        interestedFreelancerWhoWantToWorkOnThisProject: true,
        projectSlug: true,
        createdAt: true
      }
    });

    const totalProjects = await db.projects.count({ where: filters });

    const response = {
      projects,
      pagination: {
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(totalProjects / pageSize),
        totalProjects
      }
    };

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, response);
  }),
  // ** Get inhouse projects

  getAllInHouseProjects: asyncHandler(async (req, res) => {
    // Destructure and parse query parameters with types
    const { page = "1", limit = "10", nicheName = "" }: TGETPROJECTSQUERY = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    const filters: TFILTEREDPROJECT = {
      trashedAt: null,
      trashedBy: null,
      projectType: "INHOUSE",
      projectStatus: "PENDING",
      niche: nicheName
    };
    const projects = await db.projects.findMany({
      where: filters,
      skip,
      take: pageSize,
      select: {
        id: true,
        title: true,
        detail: true,
        deadline: true,
        bounty: true,
        progressPercentage: true,
        niche: true,
        dfficultyLevel: true,
        projectSlug: true,
        createdAt: true
      }
    });

    const totalProjects = await db.projects.count({ where: filters });

    const response = {
      projects,
      pagination: {
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(totalProjects / pageSize),
        totalProjects
      }
    };

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, response);
  })
};
