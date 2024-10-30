import quickerUtils from "../../utils/quickerUtils";
import { httpResponse } from "../../utils/apiResponseUtils";
import { INTERNALSERVERERRORMSG, SUCCESSCODE, SUCCESSMSG } from "../../constants";
import { Request, Response } from "express";

export default {
  health: (req: Request, res: Response) => {
    try {
      const healthData = {
        applicationHealth: quickerUtils.getApplicationHealth(),
        systemHealth: quickerUtils.getSystemHealth()
      };
      httpResponse(req, res, SUCCESSCODE, SUCCESSMSG, healthData);
    } catch (error) {
      if (error instanceof Error) {
        throw {
          status: 500,
          message: error.message || INTERNALSERVERERRORMSG
        };
      }
    }
  }
};
