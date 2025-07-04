import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { UserRepository } from "../repositories/users.repository";
import { container } from "../../../composition.root";

export const findUserMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const userRepository = container.resolve(UserRepository)
  const user = await userRepository.findUserById(req.user.id);

  if (!user) {
    return next(ApiError.NotFound("The requested user was not found"));
  }
  next();
};
