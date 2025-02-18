import { NextFunction, Request, Response } from "express";
import { PostService } from "./posts.service";
import { ApiError } from "../../exeptions/api-error";
import { PostInputModel } from "./posts.models";
import { injectable } from "inversify";
import { PostQueryRepository } from "./repositories/posts.query-repository";

@injectable()
export class PostController {
  constructor(private readonly postService: PostService, private readonly postQueryRepository: PostQueryRepository) {}

  async getAllPosts(req: Request<{}, {}, {}, { page: number; pageSize: number }>, res: Response, next: NextFunction) {
    try {
      const { page, pageSize } = req.query;
      const posts = await this.postQueryRepository.getAllPosts(page, pageSize);
      res.status(200).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async getUserPosts(req: Request<{ user_id: string }, {}, {}, { page: number; pageSize: number }>, res: Response, next: NextFunction) {
    try {
      const { page, pageSize } = req.query;
      const posts = await this.postQueryRepository.getUserPosts(req.params.user_id, page, pageSize);
      res.status(200).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async createPost(req: Request<{}, {}, PostInputModel>, res: Response, next: NextFunction) {
    try {
      const newPost = this.postService.createPost(req.body, req.user.id);
      res.status(201).json(newPost);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
