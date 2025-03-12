import type { Milestone } from "@prisma/client";
import { BADREQUESTCODE } from "../constants";
import { db } from "../database/db";
import throwError from "./throwErrorUtils";

export const updateProjectProgress = async (projectId: number): Promise<void> => {
  if (!projectId) throwError(BADREQUESTCODE, "Invalid project ID");

  // Get all milestones for the project
  const milestones = await db.milestone.findMany({
    where: { projectId }
  });

  if (!milestones || milestones.length === 0) return;

  // Calculate total progress and total points
  const totalProgressPoints = milestones.reduce((sum, milestone) => sum + (milestone.totalProgressPoints || 0), 0);

  const totalProgress = milestones.reduce((sum, milestone) => sum + (milestone.progress || 0), 0);

  // Update project progress percentage
  const progressPercentage = totalProgressPoints > 0 ? Math.ceil((totalProgress / totalProgressPoints) * 100) : 0;

  await db.project.update({
    where: { id: projectId },
    data: { progressPercentage }
  });
};

/**
 * Distributes total progress points among milestones based on priority
 * @param milestones Array of milestone data
 * @returns Array of milestones with updated totalProgressPoints
 */
export const distributeMilestonePoints = (milestones: Milestone[]): Milestone[] => {
  if (!milestones || milestones.length === 0) return milestones;

  // Get sum of all priority ranks
  const totalPriorities = milestones.reduce((sum, milestone) => sum + (milestone.priorityRank || 1), 0);

  if (totalPriorities <= 0) throwError(BADREQUESTCODE, "Invalid priority ranks");

  // Distribute 100 points proportionally based on priority rank
  return milestones.map((milestone) => {
    const priorityWeight = (milestone.priorityRank || 1) / totalPriorities;
    // Higher priority gets more points
    const points = Math.round(100 * priorityWeight);
    return {
      ...milestone,
      totalProgressPoints: points > 0 ? points : 1 // Ensure at least 1 point
    };
  });
};
