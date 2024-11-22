import { BADREQUESTCODE } from "../constants";
import { db } from "../database/db";

type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";

interface ProjectRatingInput {
  difficulty: DifficultyLevel;
  rating: number;
  uid: string;
}

export async function calculateKpiPoints(input: ProjectRatingInput): Promise<number> {
  const { difficulty, rating, uid } = input;

  if (rating < 1 || rating > 5) {
    throw { status: BADREQUESTCODE, message: "Rating must be between 1 and 5." };
  }

  const user = await db.user.findUnique({ where: { uid } });
  if (!user) {
    throw { status: BADREQUESTCODE, message: "User not found." };
  }

  const currentPoints = user.kpiRankPoints || 0;

  const basePoints: Record<DifficultyLevel, number> = {
    EASY: 20,
    MEDIUM: 40,
    HARD: 60
  };

  const earnedPoints = Math.round((rating / 5) * basePoints[difficulty]);

  const totalPoints = currentPoints + earnedPoints;
  await db.user.update({
    where: { uid },
    data: { kpiRankPoints: totalPoints }
  });

  return totalPoints;
}
