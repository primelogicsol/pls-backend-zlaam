import type { Request, Response } from "express";
import { httpResponse } from "../../utils/apiResponseUtils";
export default {
  self: (req: Request, res: Response) => {
    const her = false;
    if (!her) throw { status: 400, message: "Bad request" };
    httpResponse(req, res, 200, "process was success", null);
  }
};
