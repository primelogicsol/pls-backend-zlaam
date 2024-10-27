import type { Request, Response } from "express";
import type { httpResponseType } from "../types";
import { ENV } from "../config/config";

const jsonResponse = (
  status: number,
  message: string = "OK",
  data: object | null | object[] = null,
  metaData: object | null | object[] = null,
  optMessage: string = ""
) => {
  return {
    success: status < 400,
    statusCode: status,
    message: message,
    data: data,
    metaData: metaData,
    optMessage: optMessage
  };
};
const httpResponse = (req: Request, res: Response, statusCode: number, message: string, data: unknown = null): Response => {
  const response: httpResponseType = {
    success: 400 < statusCode,
    status: statusCode,
    message,
    data,
    requestInfo: {
      url: req.url,
      ip: req.ip || null,
      method: req.method
    }
  };
  if (ENV && ENV === "PRODUCTION") {
    delete response.requestInfo.ip;
  }
  return res.status(statusCode).json(response);
};
export { jsonResponse, httpResponse };
