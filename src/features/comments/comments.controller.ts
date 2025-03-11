import { NextFunction, Request, Response } from "express";
import { CommentsService } from "./comments.service";
import { ApiError } from "../../exeptions/api-error";
import { CommentInputModel } from "./comments.models";
import { injectable } from "inversify";
import { CommentsQueryRepository } from "./repositories/comments.query-repository";

@injectable()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService, private readonly commentsQueryRepository: CommentsQueryRepository) {}

  async getCommentsByPostId(req: Request<{ post_id: string }, {}, {}, { pageNumber: string; pageSize: string }>, res: Response, next: NextFunction) {
    try {
      const { pageNumber, pageSize } = req.query;
      const comments = await this.commentsQueryRepository.getCommentsByPostId(req.params.post_id, pageNumber, pageSize);
      res.status(200).json(comments);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async createComment(req: Request<{}, {}, CommentInputModel>, res: Response, next: NextFunction) {
    try {
      const newCommentId = await this.commentsService.createComment(req.body, req.user.id);
      const newComment = await this.commentsQueryRepository.getCommentById(newCommentId);
      res.status(201).json(newComment);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
