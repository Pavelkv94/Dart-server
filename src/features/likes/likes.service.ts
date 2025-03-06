import { injectable } from "inversify";
import { LikesRepository } from "./likes.repository";
import { LikeInputModel } from "./likes.models";

@injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikesRepository) {}

  async like(likeInputModel: LikeInputModel, user_id: string) {
    const like = await this.likesRepository.like({ ...likeInputModel, user_id });
    return like;
  }
}
