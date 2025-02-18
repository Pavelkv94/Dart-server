import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { ApiLogInputModel } from "../../apiLogs/models/apiLog.model";
import { container } from "../../../composition.root";
import { ApiLogsService } from "../../apiLogs/apiLogs.service";

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const apiLogsService = container.resolve(ApiLogsService);

  const newAPiLog: ApiLogInputModel = {
    ip: req.ip || "",
    URL: req.originalUrl || req.baseUrl,
    date: new Date().getTime(),
  };

  await apiLogsService.saveLog(newAPiLog);

  const rateLimitOptions = {
    ip: req.ip || "",
    baseUrl: req.originalUrl || req.baseUrl,
    limit: 5, //attempts
    rate: 10, //time interval
  };

  const isAllowedRequest = await apiLogsService.checkRateLimit(rateLimitOptions);

  if (!isAllowedRequest) {
    return next(ApiError.TooManyRequests());
  }
  next();
};
