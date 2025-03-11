export type Comment = {

  //   likes: string[];
  //   comments: string[];
};

export type CommentInputModel = {
  post_id: string;
  comment: string;
};

export type CommentNode = {
  id: string;
  commentator_id: string
  post_id: string;
  comment: string;
  createdAt: string;
  // user: { id: string; first_name: string; last_name: string };
};
