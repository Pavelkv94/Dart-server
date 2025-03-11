// import { PostNode } from "../posts.models";

export type MessageType = {
  user_id: string;
  message: string;
  event: string;
  createdAt: string;
  image: string;
  id: string;
};



// export class PostViewDto {
//   id: string;
//   text: string;
//   createdAt: string;

//   constructor(model: PostNode) {
//     this.id = model.id;
//     this.text = model.text;
//     this.createdAt = model.createdAt;
//   }

//   static mapToView(post: PostNode): PostViewDto {
//     return new PostViewDto(post);
//   }

//   static mapToViewArray(posts: PostNode[]): PostViewDto[] {
//     return posts.map(PostViewDto.mapToView);
//   }
// }
