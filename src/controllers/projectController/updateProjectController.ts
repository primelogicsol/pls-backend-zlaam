import { BADREQUESTCODE, NOTFOUNDCODE, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { db } from "../../database/db";
import type { TPROJECT } from "../../types";
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
    if (!progressPercentage) throw { status: BADREQUESTCODE, message: "Progress percentage is required." };
    if (isNaN(progressPercentage)) throw { status: BADREQUESTCODE, message: "Progress percentage must be a number." };
    if (!projectSlug) throw { status: BADREQUESTCODE, message: "Project slug is required." };
    const project = await db.projects.update({ where: { projectSlug: projectSlug }, data: { progressPercentage: Number(progressPercentage) } });
    if (!project) throw { status: NOTFOUNDCODE, message: "Project not found." };
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
  })
};
