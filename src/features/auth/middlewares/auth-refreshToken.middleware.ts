import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { container } from "../../../composition.root";
import { AuthService } from "../auth.service";

export type InjectedUserType = {
  id: string;
  device_id: string;
};

export const authRefreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authService = container.resolve(AuthService);
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  const payload = await authService.checkRefreshToken(token);

  if (!payload) {
    return next(ApiError.Unauthorized("Unauthorized"));
  }

  req.user = { id: payload.user_id, device_id: payload.device_id } as InjectedUserType;

  next();
};
