import { BADREQUESTCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { TPROJECT } from "../../types";
import { httpResponse } from "../../utils/apiResponseUtils";
import { asyncHandler } from "../../utils/asyncHandlerUtils";

export default {
  // ** Update Project By Slug
  updateProgressOfProject: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    const { progressPercentage } = req.body as TPROJECT;
    if (!progressPercentage) throw { status: BADREQUESTCODE, message: "Progress percentage is required." };
    if (isNaN(progressPercentage)) throw { status: BADREQUESTCODE, message: "Progress percentage must be a number." };
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.update({ where: { projectSlug: projectSlug }, data: { progressPercentage: Number(progressPercentage) } });
    if (!project) throw { status: BADREQUESTCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { progressPercentage: project.progressPercentage });
  }),
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
    if (!project) throw { status: BADREQUESTCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { interestedFreelancers: project.interestedFreelancerWhoWantToWorkOnThisProject });
  }),
  // ** List all the interested freelancers who want to work on this project
  listInterestedFreelancers: asyncHandler(async (req, res) => {
    const { projectSlug } = req.params;
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.findUnique({
      where: { projectSlug: projectSlug },
      select: { interestedFreelancerWhoWantToWorkOnThisProject: true }
    });
    if (!project) throw { status: BADREQUESTCODE, message: "Project not found." };
    httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, { interestedFreelancers: project.interestedFreelancerWhoWantToWorkOnThisProject });
  })
};
