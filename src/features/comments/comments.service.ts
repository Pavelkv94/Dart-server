import { injectable } from "inversify";
import { CommentsRepository } from "./repositories/comments.repository";
import { CommentInputModel } from "./comments.models";
import { randomUUID } from "crypto";

@injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  createComment(comment: CommentInputModel, user_id: string) {
    const newComment = {
      id: randomUUID(),
      commentator_id: user_id,
      post_id: comment.post_id,
      comment: comment.comment,
      createdAt: new Date().toISOString(),
      deletedAt: null,
    }

    return this.commentsRepository.createComment(newComment);
  }
  // createPost(post: PostInputModel, user_id: string) {

  //   const newPost = {
  //       id: randomUUID(),
  //       image_url: post.image_url,
  //       user_id: user_id,
  //       text: post.text,
  //       createdAt: new Date().toISOString(),
  //       deletedAt: null,
  //   }
  //   return this.commentsRepository.createPost(newPost);
  // }
}
