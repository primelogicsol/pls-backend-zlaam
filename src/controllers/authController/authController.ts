import type { Request, Response } from "express";
import { httpResponse } from "../../utils/apiResponseUtils";
export default {
  self: (req: Request, res: Response) => {
    httpResponse(req, res, 200, "process was success", null);
  }
};
