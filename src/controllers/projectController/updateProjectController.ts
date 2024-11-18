import { BADREQUESTCODE, NOTFOUNDCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { TFILTEREDPROJECT, TGETFULLPROJECTQUERY, TPROJECT, TSORTORDER } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  // ** create List of interested freelancers who want to work on this project
  createInterestedFreelancers: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    const { interestedFreelancerWhoWantToWorkOnThisProject } = req.body as TPROJECT;
    if (!interestedFreelancerWhoWantToWorkOnThisProject) throw { status: BADREQUESTCODE, message: "Field is required." };
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.update({
      where: { projectSlug: projectSlug },
      data: { interestedFreelancerWhoWantToWorkOnThisProject: interestedFreelancerWhoWantToWorkOnThisProject }
    });
    if (!project) throw { status: NOTFOUNDCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { interestedFreelancers: project.interestedFreelancerWhoWantToWorkOnThisProject });
  }),
  // ** Update Project By Slug
  updateProgressOfProject: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    const { progressPercentage } = req.body as TPROJECT;
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    if (!progressPercentage) throw { status: BADREQUESTCODE, message: "Progress percentage is required." };
    if (isNaN(progressPercentage)) throw { status: BADREQUESTCODE, message: "Progress percentage must be a number." };
    if (progressPercentage > 100 || progressPercentage < 0)
      throw { status: BADREQUESTCODE, message: "Progress percentage must be between 0 and 100." };
    const project = await db.projects.update({ where: { projectSlug: projectSlug }, data: { progressPercentage: Number(progressPercentage) } });
    if (!project) throw { status: NOTFOUNDCODE, message: "Project not found." };
    if (project.progressPercentage === 100) {
      await db.projects.update({ where: { projectSlug: projectSlug }, data: { projectStatus: "COMPLETED" } });
    }
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { progressPercentage: project.progressPercentage });
  }),
  // ** List all the interested freelancers who want to work on this project
  listInterestedFreelancers: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.findUnique({
      where: { projectSlug: projectSlug },
      select: { interestedFreelancerWhoWantToWorkOnThisProject: true }
    });
    if (!project) throw { status: NOTFOUNDCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { interestedFreelancers: project.interestedFreelancerWhoWantToWorkOnThisProject });
  }),
  // ** Change the status of a project
  changeProjectStatus: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    const { projectStatus } = req.body as TPROJECT;
    if (!projectStatus) throw { status: BADREQUESTCODE, message: "Field is required." };
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.update({ where: { projectSlug: projectSlug }, data: { projectStatus: projectStatus } });
    if (!project) throw { status: NOTFOUNDCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { projectStatus: project.projectStatus });
  }),
  // ** Change the Project Type
  changeProjectType: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    const { projectType } = req.body as TPROJECT;
    if (!projectType) throw { status: BADREQUESTCODE, message: "Field is required." };
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.update({ where: { projectSlug: projectSlug }, data: { projectType: projectType } });
    if (!project) throw { status: NOTFOUNDCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { projectType: project.projectType });
  }),
  // ** Get All Projects

  getAllProjects: asyncHandler(async (req, res) => {
    // Destructure and parse query parameters with types
    const {
      page = "1",
      limit = "10",
      difficultyLevel = "EASY",
      nicheName = "",
      projectType = "",
      projectStatus = ""
    }: TGETFULLPROJECTQUERY = req.query;
    let { createdAtOrder = "", bountyOrder = "" }: TGETFULLPROJECTQUERY = req.query;
    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    const filters: TFILTEREDPROJECT = {
      trashedAt: null,
      trashedBy: null
    };

    if (difficultyLevel) {
      filters.difficultyLevel = difficultyLevel;
    }
    if (nicheName) {
      filters.niche = nicheName;
    }
    if (projectType) {
      filters.projectType = projectType;
    }
    if (projectStatus) {
      filters.projectStatus = projectStatus;
    }

    const orderBy: TSORTORDER[] = [];
    if (createdAtOrder) {
      bountyOrder = "";
      orderBy.push({
        createdAt: createdAtOrder === "latest" ? "desc" : "asc"
      });
    }
    if (bountyOrder) {
      createdAtOrder = "";
      orderBy.push({
        bounty: bountyOrder === "highest" ? "desc" : "asc"
      });
    }

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
  })
};
