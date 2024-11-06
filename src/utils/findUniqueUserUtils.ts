import { BADREQUESTCODE, INTERNALSERVERERRORMSG, NOTFOUNDCODE, NOTFOUNDMSG } from "../constants";
import { db } from "../database/db";
import type { TUSER } from "../types";
import logger from "./loggerUtils";

export const findUniqueUser = async (id: string): Promise<TUSER> => {
  if (!id) throw { status: BADREQUESTCODE, message: "Id is required!" };
  let user: unknown = null;
  try {
    user = (await db.user.findUnique({
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
