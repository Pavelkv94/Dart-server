export enum LikeStatus {
  None = "None",
  Like = "Like",
  Dislike = "Dislike",
}
export enum LikeParentType {
  Post = "Post",
  Comment = "Comment",
}
export type LikeInputModel = {
  parent_id: string;
  parent_type: LikeParentType;
  like_status: LikeStatus;
};
