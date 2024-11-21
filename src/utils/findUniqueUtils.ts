import { BADREQUESTCODE, INTERNALSERVERERRORMSG, NOTFOUNDCODE, NOTFOUNDMSG } from "../constants";
import { db } from "../database/db";
import type { TPROJECT, TUSER } from "../types";
import logger from "./loggerUtils";

export const findUniqueUser = async (id: string): Promise<TUSER> => {
  if (!id) throw { status: BADREQUESTCODE, message: "Id is required!" };
  let user: unknown = null;
  try {
    user = (await db.user.findUniqueOrThrow({
      where: {
        uid: id
      },
      select: {
        uid: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })) as TUSER;
    if (!user) {
      logger.error("User not found in findUniqueUserUtils.ts");
      throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    } else return user as TUSER;
  } catch (error) {
    if (error instanceof Error) throw { status: NOTFOUNDCODE, message: error.message || INTERNALSERVERERRORMSG };
    else throw { status: NOTFOUNDCODE, message: INTERNALSERVERERRORMSG };
  }
};

export const findUniqueProject = async (uniqueIdentifier: string): Promise<TPROJECT> => {
  if (!uniqueIdentifier) throw { status: BADREQUESTCODE, message: "Id is required!" };
  let project: unknown = null;
  try {
    project = await db.project.findUniqueOrThrow({ where: { projectSlug: uniqueIdentifier } });
    if (!project) {
      logger.error("project not found in findUniqueUtils.ts");
      throw { status: NOTFOUNDCODE, message: NOTFOUNDMSG };
    } else return project as TPROJECT;
  } catch (error) {
    if (error instanceof Error) throw { status: NOTFOUNDCODE, message: error.message || INTERNALSERVERERRORMSG };
    else throw { status: NOTFOUNDCODE, message: INTERNALSERVERERRORMSG };
  }
};

export const getFreelancerUsernamesWhoAreInterested = async (freelancerIds: string[]): Promise<string[]> => {
  try {
    return await Promise.all(
      freelancerIds.map(async (freelancerId) => {
        const user = await db.user.findUniqueOrThrow({
          where: { uid: freelancerId, trashedBy: null, trashedAt: null, role: "FREELANCER" },
          select: { username: true }
        });
        return user.username;
      })
    );
  } catch (errr) {
    if (errr instanceof Error) throw { status: NOTFOUNDCODE, message: errr.message + " with freelancer role" || INTERNALSERVERERRORMSG };
    else throw { status: NOTFOUNDCODE, message: INTERNALSERVERERRORMSG };
  }
};
