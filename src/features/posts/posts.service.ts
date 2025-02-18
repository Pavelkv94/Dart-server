import { injectable } from "inversify";
import { PostRepository } from "./repositories/posts.repository";
import { PostInputModel } from "./posts.models";
import { randomUUID } from "crypto";

@injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  createPost(post: PostInputModel, user_id: string) {

    const newPost = {
        id: randomUUID(),
        image_url: post.image_url,
        user_id: user_id,
        text: post.text,
        createdAt: new Date().toISOString(),
        deletedAt: null,
    }
    return this.postRepository.createPost(newPost);
  }
}
