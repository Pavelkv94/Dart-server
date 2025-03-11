import { CommentNode } from "../comments.models";

export class CommentViewDto {
  id: string;
  post_id: string;
  commentator_id: string;
  comment: string;
  createdAt: string;

  constructor(model: CommentNode) {
    this.id = model.id;
    this.comment = model.comment;
    this.createdAt = model.createdAt;
    this.post_id = model.post_id;
    this.commentator_id = model.commentator_id;
  }

  static mapToView(comment: CommentNode): CommentViewDto {
    return new CommentViewDto(comment);
  }
}
