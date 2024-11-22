import { BADREQUESTCODE } from "../constants";
import { db } from "../database/db";
import type { TKPIRANK } from "../types";

const rankThresholds: Record<string, number> = {
  BRONZE: 0,
  SILVER: 200,
  GOLD: 500,
  PLATINUM: 1000,
  DIAMOND: 1500,
  CROWN: 1800,
  ACE: 2000,
  CONQUEROR: 2500
};

export async function updateFreelancerRank(uid: string, kpiPoints: number): Promise<TKPIRANK> {
  const user = await db.user.findUnique({ where: { uid } });
  if (!user) {
    throw { status: BADREQUESTCODE, message: "User not found." };
  }

  let newRank: TKPIRANK = user.kpiRank;
  for (const [rank, threshold] of Object.entries(rankThresholds)) {
    if (kpiPoints >= threshold && rank !== user.kpiRank) {
      newRank = rank as TKPIRANK;
    }
  }

  if (newRank !== user.kpiRank) {
    await db.user.update({
      where: { uid },
      data: { kpiRank: newRank }
    });
  }

  return newRank;
}
