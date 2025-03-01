import { BADREQUESTCODE, NOTFOUNDCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { TFILTEREDPROJECT, TGETFULLPROJECTQUERY, TSORTORDER } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  getAllProjectsWithThierClient: asyncHandler(async (req, res) => {
    const { clientId } = req.params;
    const { page = "1", limit = "10" } = req.query;
    if (!clientId) throw { status: BADREQUESTCODE, message: "Client id is required" };
    const client = await db.user.findFirst({
      where: {
        uid: clientId,
        role: "CLIENT"
      }
    });

    if (!client) {
      throw { status: NOTFOUNDCODE, message: "Client not found" };
    }

    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    if (isNaN(pageNumber) || isNaN(pageLimit) || pageNumber <= 0 || pageLimit <= 0) {
      throw { status: BADREQUESTCODE, message: "Invalid pagination parameters!!" };
    }

    const skip = (pageNumber - 1) * pageLimit;
    const take = pageLimit;

    const projects = await db.project.findMany({
      where: {
        clientWhoPostedThisProjectForeignId: clientId,
        trashedAt: null,
        trashedBy: null
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc"
      },
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
        projectStatus: true,
        interestedFreelancers: {
          select: {
            uid: true,
            username: true,
            fullName: true,
            email: true
          }
        },
        selectedFreelancers: {
          select: {
            uid: true,
            username: true,
            fullName: true,
            email: true
          }
        },
        projectSlug: true,
        createdAt: true,
        clientWhoPostedThisProject: {
          select: {
            uid: true,
            fullName: true,
            email: true,
            username: true
          }
        }
      }
    });

    const totalProjects = await db.project.count({
      where: {
        clientWhoPostedThisProjectForeignId: clientId,
        trashedAt: null,
        trashedBy: null
      }
    });

    const totalPages = Math.ceil(totalProjects / pageLimit);
    const hasNextPage = totalPages > pageNumber;
    const hasPreviousPage = pageNumber > 1;

    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, {
      projects,
      pagination: {
        totalPages,
        totalProjects,
        currentPage: pageNumber,
        hasPreviousPage,
        hasNextPage
      }
    });
  }),

  getAllProjects: asyncHandler(async (req, res) => {
    // Destructure and parse query parameters with types
    const { page = "1", limit = "10", difficultyLevel, nicheName = "", projectType = "", projectStatus = "" }: TGETFULLPROJECTQUERY = req.query;
    let { createdAtOrder = "latest", bountyOrder = "" }: TGETFULLPROJECTQUERY = req.query;
    const pageNum = Number(page || 10);
    const pageSize = Number(limit || 10);
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

    const projects = await db.project.findMany({
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
        projectStatus: true,
        projectSlug: true,
        createdAt: true
      }
    });

    const totalProjects = await db.project.count({ where: { ...filters } });

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
