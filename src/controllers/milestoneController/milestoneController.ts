import type { Milestone } from "@prisma/client";
import { asyncHandler } from "../../utils/asyncHandlerUtils";
import { db } from "../../database/db";
import throwError from "../../utils/throwErrorUtils";
import { BADREQUESTCODE, CREATEDCODE, NOTFOUNDCODE, NOTFOUNDMSG } from "../../constants";
import { httpResponse } from "../../utils/apiResponseUtils";
import { distributeMilestonePoints, updateProjectProgress } from "../../utils/updateProjectProgressUtils";

/**
 * Updates the project progress percentage based on all milestones
 * @param projectId The ID of the project to update
 */
export default {
  createSingleProjectMilestone: asyncHandler(async (req, res) => {
    const milestoneData = req.body as Milestone;
    // TODO: VALIDATION YET TO BE HANDLED
    const projectId = req.params.projectId as string;

    if (!projectId) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    const project = await db.project.findUnique({ where: { id: Number(projectId) } });
    if (!project) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    const milestone = await db.milestone.findUnique({ where: { mileStoneName: milestoneData.mileStoneName } });
    if (milestone) throwError(BADREQUESTCODE, "Milestone already exists");

    // Get existing milestones for this project
    const existingMilestones = await db.milestone.findMany({
      where: { projectId: Number(projectId) }
    });

    if (!existingMilestones) throwError(BADREQUESTCODE, "Failed to fetch existing milestones");

    // Calculate appropriate totalProgressPoints for the new milestone
    const allMilestones = [...existingMilestones, { ...milestoneData, projectId: Number(projectId) }];
    const updatedMilestones = distributeMilestonePoints(allMilestones);

    if (!updatedMilestones || updatedMilestones.length === 0) {
      throwError(BADREQUESTCODE, "Failed to distribute milestone points");
    }

    // Create the new milestone with appropriate points
    const newMilestoneIndex = existingMilestones.length;
    const newTotalPoints = updatedMilestones[newMilestoneIndex]?.totalProgressPoints || 100;

    await db.milestone.create({
      data: {
        ...milestoneData,
        projectId: Number(projectId),
        totalProgressPoints: newTotalPoints
      }
    });

    // Update existing milestones with new point distribution
    for (let i = 0; i < existingMilestones.length; i++) {
      if (!existingMilestones[i] || !existingMilestones[i]?.id) continue;

      const updatedPoints = updatedMilestones[i]?.totalProgressPoints || 0;

      await db.milestone.update({
        where: { id: Number(existingMilestones[i]?.id) },
        data: { totalProgressPoints: updatedPoints }
      });
    }

    // Update project progress
    await updateProjectProgress(Number(projectId));

    httpResponse(req, res, CREATEDCODE, "Project Milestone created successfully");
  }),

  createMultipleMileStones: asyncHandler(async (req, res) => {
    const milestoneData = req.body as Milestone[];

    // TODO: VALIDATION YET TO BE HANDLED
    const projectId = req.params.projectId as string;

    if (!projectId) throwError(NOTFOUNDCODE, NOTFOUNDMSG);
    if (!milestoneData || milestoneData.length === 0) throwError(BADREQUESTCODE, "No milestone data provided");

    const mileStoneNames = milestoneData.map((milestone) => milestone.mileStoneName).filter(Boolean);
    if (mileStoneNames.length === 0) throwError(BADREQUESTCODE, "Invalid milestone names");

    const existingMilestones = await db.milestone.findMany({
      where: { mileStoneName: { in: mileStoneNames } }
    });

    if (existingMilestones && existingMilestones.length > 0) throwError(BADREQUESTCODE, "Milestone already exists");

    const project = await db.project.findUnique({ where: { id: Number(projectId) } });
    if (!project) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    // Get existing milestones for this project
    const projectMilestones = await db.milestone.findMany({
      where: { projectId: Number(projectId) }
    });

    if (!projectMilestones) throwError(BADREQUESTCODE, "Failed to fetch existing milestones");

    // Calculate totalProgressPoints for all milestones
    const allMilestones = [...projectMilestones, ...milestoneData.map((milestone) => ({ ...milestone, projectId: Number(projectId) }))];

    const updatedMilestones = distributeMilestonePoints(allMilestones);

    if (!updatedMilestones || updatedMilestones.length === 0) {
      throwError(BADREQUESTCODE, "Failed to distribute milestone points");
    }

    // Create new milestones with appropriate points
    const startIndex = projectMilestones.length;
    const newMilestonesWithPoints = milestoneData.map((milestone, index) => {
      const updatedIndex = startIndex + index;
      const points = updatedMilestones[updatedIndex]?.totalProgressPoints || Math.floor(100 / milestoneData.length);

      return {
        ...milestone,
        projectId: Number(projectId),
        totalProgressPoints: points
      };
    });

    await db.milestone.createMany({ data: newMilestonesWithPoints });

    // Update existing milestones with new point distribution
    for (let i = 0; i < projectMilestones.length; i++) {
      if (!projectMilestones[i] || !projectMilestones[i]?.id) continue;

      const updatedPoints = updatedMilestones[i]?.totalProgressPoints || 0;

      await db.milestone.update({
        where: { id: Number(projectMilestones[i]?.id) },
        data: { totalProgressPoints: updatedPoints }
      });
    }

    // Update project progress
    await updateProjectProgress(Number(projectId));

    httpResponse(req, res, CREATEDCODE, "Project Milestones created successfully");
  }),

  updateMileStone: asyncHandler(async (req, res) => {
    const milestoneData = req.body as Milestone;

    // TODO: VALIDATION YET TO BE HANDLED
    const milestoneId = req.params.milestoneId as string;

    if (!milestoneId) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    const milestone = await db.milestone.findUnique({ where: { id: Number(milestoneId) } });
    if (!milestone) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    await db.milestone.update({ where: { id: Number(milestoneId) }, data: milestoneData });

    // If priority rank was updated, redistribute points
    if (milestoneData.priorityRank !== undefined && milestoneData.priorityRank !== milestone?.priorityRank && milestone?.projectId) {
      const projectMilestones = await db.milestone.findMany({
        where: { projectId: milestone.projectId }
      });

      if (!projectMilestones || projectMilestones.length === 0) {
        throwError(BADREQUESTCODE, "Failed to fetch project milestones");
      }

      const updatedMilestones = distributeMilestonePoints(projectMilestones);

      if (!updatedMilestones || updatedMilestones.length === 0) {
        throwError(BADREQUESTCODE, "Failed to redistribute milestone points");
      }

      // Update all milestones with new point distribution
      for (let i = 0; i < projectMilestones.length; i++) {
        if (!projectMilestones[i] || !projectMilestones[i]?.id) continue;

        const updatedPoints = updatedMilestones[i]?.totalProgressPoints || 0;

        await db.milestone.update({
          where: { id: Number(projectMilestones[i]?.id) },
          data: { totalProgressPoints: updatedPoints }
        });
      }
    }

    // Update project progress
    if (milestone?.projectId) {
      await updateProjectProgress(milestone.projectId);
    }

    httpResponse(req, res, CREATEDCODE, "Project Milestone updated successfully");
  }),

  deleteMileStone: asyncHandler(async (req, res) => {
    const milestoneId = req.params.milestoneId as string;

    if (!milestoneId) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    const milestone = await db.milestone.findUnique({ where: { id: Number(milestoneId) } });
    if (!milestone) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    const projectId = milestone?.projectId;
    if (!projectId) throwError(BADREQUESTCODE, "Invalid project ID in milestone");

    await db.milestone.delete({ where: { id: Number(milestoneId) } });

    // Get remaining milestones and redistribute points
    const remainingMilestones = await db.milestone.findMany({
      where: { projectId: Number(projectId) }
    });

    if (!remainingMilestones) {
      throwError(BADREQUESTCODE, "Failed to fetch remaining milestones");
      return;
    }
    if (remainingMilestones && remainingMilestones.length > 0) {
      const updatedMilestones = distributeMilestonePoints(remainingMilestones);

      if (!updatedMilestones || updatedMilestones.length === 0) {
        throwError(BADREQUESTCODE, "Failed to redistribute milestone points");
      }

      // Update all milestones with new point distribution
      for (let i = 0; i < remainingMilestones.length; i++) {
        if (!remainingMilestones[i] || !remainingMilestones[i]?.id) continue;

        const updatedPoints = updatedMilestones[i]?.totalProgressPoints || 0;

        await db.milestone.update({
          where: { id: Number(remainingMilestones[i]?.id) },
          data: { totalProgressPoints: updatedPoints }
        });
      }
    }

    // Update project progress
    await updateProjectProgress(Number(projectId));

    httpResponse(req, res, CREATEDCODE, "Project Milestone deleted successfully");
  }),

  completeMileStone: asyncHandler(async (req, res) => {
    const milestoneId = req.params.milestoneId as string;

    if (!milestoneId) throwError(NOTFOUNDCODE, NOTFOUNDMSG);

    const milestone = await db.milestone.findUnique({ where: { id: Number(milestoneId) } });
    if (!milestone) {
      throwError(NOTFOUNDCODE, NOTFOUNDMSG);
      return;
    }

    const projectId = milestone.projectId;
    if (!projectId) throwError(BADREQUESTCODE, "Invalid project ID in milestone");

    // Update milestone as completed and set its progress to full
    await db.milestone.update({
      where: { id: Number(milestoneId) },
      data: {
        isMilestoneCompleted: true,
        progress: milestone.totalProgressPoints
      }
    });

    // Update project progress
    await updateProjectProgress(projectId);

    httpResponse(req, res, CREATEDCODE, "Project Milestone completed successfully");
  }),

  updateMilestoneProgress: asyncHandler(async (req, res) => {
    const milestoneId = req.params.milestoneId as string;
    const { progress } = req.body as { progress: number };

    if (!milestoneId) throwError(NOTFOUNDCODE, NOTFOUNDMSG);
    if (progress === undefined || progress === null) throwError(BADREQUESTCODE, "Progress value is required");

    const milestone = await db.milestone.findUnique({ where: { id: Number(milestoneId) } });
    if (!milestone) {
      throwError(NOTFOUNDCODE, NOTFOUNDMSG);
      return;
    }

    const projectId = milestone?.projectId;
    if (!projectId) throwError(BADREQUESTCODE, "Invalid project ID in milestone");
    if (progress < 0 || progress > milestone?.totalProgressPoints) {
      throwError(BADREQUESTCODE, `Progress must be between 0 and ${milestone?.totalProgressPoints}`);
    }

    // Update milestone progress
    await db.milestone.update({
      where: { id: Number(milestoneId) },
      data: {
        progress,
        isMilestoneCompleted: progress === milestone?.totalProgressPoints
      }
    });

    // Update project progress
    await updateProjectProgress(projectId);

    httpResponse(req, res, CREATEDCODE, "Milestone progress updated successfully");
  })
};
