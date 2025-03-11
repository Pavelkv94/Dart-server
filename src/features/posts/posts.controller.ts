import { NextFunction, Request, Response } from "express";
import { PostService } from "./posts.service";
import { ApiError } from "../../exeptions/api-error";
import { PostInputModel } from "./posts.models";
import { injectable } from "inversify";
import { PostQueryRepository } from "./repositories/posts.query-repository";

@injectable()
export class PostController {
  constructor(private readonly postService: PostService, private readonly postQueryRepository: PostQueryRepository) {}

  async getAllPosts(req: Request<{}, {}, {}, { pageNumber: string; pageSize: string }>, res: Response, next: NextFunction) {
    try {
      const { pageNumber, pageSize } = req.query;
      const posts = await this.postQueryRepository.getAllPosts(pageNumber, pageSize);
      res.status(200).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async getUserPosts(req: Request<{ user_id: string }, {}, {}, { pageNumber: string; pageSize: string }>, res: Response, next: NextFunction) {
    try {
      const { pageNumber, pageSize } = req.query;

      const posts = await this.postQueryRepository.getUserPosts(req.params.user_id, pageNumber, pageSize);
      res.status(200).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async createPost(req: Request<{}, {}, PostInputModel>, res: Response, next: NextFunction) {
    try {
      const newPostId = await this.postService.createPost(req.body, req.user.id);
      const newPost = await this.postQueryRepository.getPostById(newPostId);
      res.status(201).json(newPost);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async deletePost(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const post = await this.postQueryRepository.getPostById(req.params.id);
      if (!post) {
        return next(ApiError.NotFound("Post not found"));
      }
      if (post.user_id !== req.user.id) {
        return next(ApiError.Forbidden("You are not allowed to delete this post"));
      }
      await this.postService.deletePost(req.params.id);
      res.status(204).send();
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
