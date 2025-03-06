import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../exeptions/api-error";
import { injectable } from "inversify";
import { LikesService } from "./likes.service";
import { LikeInputModel } from "./likes.models";
@injectable()
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  async like(req: Request<{}, {}, LikeInputModel, {}>, res: Response, next: NextFunction) {
    try {
      await this.likesService.like(req.body, req.user.id);
      res.status(204).send();
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
