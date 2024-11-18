import { BADREQUESTCODE, NOTFOUNDCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import { generateSlug } from "../../services/slugStringGeneratorService";
import type { TSORTORDER, TFILTEREDPROJECT, TGETPROJECTSQUERY, TPROJECT } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  createProject: asyncHandler(async (req, res) => {
    // ** validation is already handled by middleware
    const projectData = req.body as TPROJECT;
    let deadline = projectData.deadline;

    if (deadline.length === 16) {
      deadline += ":00.000Z";
    } else if (deadline.length === 19) {
      deadline += ".000Z";
    } else if (deadline.length === 23) {
      deadline += "Z";
    } else if (deadline.length !== 25) {
      throw { status: BADREQUESTCODE, message: "Please enter a valid date" };
    }

    // Validate the final date string
    const newDeadLine = new Date(deadline);
    if (isNaN(newDeadLine.getTime())) {
      throw { status: BADREQUESTCODE, message: "Invalid date format." };
    }
    const projectSlug = generateSlug(projectData.title);
    const niche = generateSlug(projectData.niche);
    const isProjectAlreadyExist = await db.projects.findUnique({ where: { projectSlug: projectSlug, title: projectData.title } });
    if (isProjectAlreadyExist) {
      throw { status: BADREQUESTCODE, message: "Project already exist with same title." };
    }
    const createdProject = await db.projects.create({ data: { ...projectData, deadline: newDeadLine, projectSlug, niche } });
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, createdProject);
  }),

  // ** Get Single Project By Slug
  getSingleProject: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.findUnique({
      where: { projectSlug: projectSlug, trashedAt: null, trashedBy: null },
      select: {
        id: true,
        title: true,
        detail: true,
        deadline: true,
        bounty: true,
        progressPercentage: true,
        niche: true,
        difficultyLevel: true,
        interestedFreelancerWhoWantToWorkOnThisProject: true,
        selectedFreelancersForThisProject: true,
        projectSlug: true,
        projectStatus: true,
        createdAt: true
      }
    });
    if (!project) throw { status: BADREQUESTCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, project);
  }),

  // ** Get All OutSourced Projects

  getAllOutsourcedProjects: asyncHandler(async (req, res) => {
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
      projectType: "OUTSOURCE" as const,
      projectStatus: "PENDING"
    };

    if (difficultyLevel) {
      filters.difficultyLevel = difficultyLevel;
    }
    if (nicheName) {
      filters.niche = nicheName;
    }

    const orderBy: TSORTORDER[] = [];

    orderBy.push({
      createdAt: createdAtOrder ? "desc" : "asc"
    });

    orderBy.push({
      bounty: bountyOrder ? "desc" : "asc"
    });

    const projects = await db.projects.findMany({
      where: { ...filters },
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
        difficultyLevel: true,
        projectType: true,
        interestedFreelancerWhoWantToWorkOnThisProject: true,
        projectSlug: true,
        createdAt: true
      }
    });

    const totalProjects = await db.projects.count({ where: { ...filters } });

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

  // **  Delete Project By Slug
  deleteProject: asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    await db.projects
      .findUniqueOrThrow({ where: { id: Number(id) } })
      .then((res) => res)
      .catch(() => {
        throw { status: NOTFOUNDCODE, message: "Project not found." };
      });
    const project = await db.projects.delete({ where: { id: Number(id) } });
    if (project) throw { status: BADREQUESTCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, null);
  })
};
