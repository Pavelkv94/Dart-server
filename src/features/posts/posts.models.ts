export type Post = {
  image_url: string;
  user_id: string;
  createdAt: string;
  deletedAt: string;
  text: string;
  //   likes: string[];
  //   comments: string[];
};

export type PostInputModel = {
  image_url: string;
  text: string;
};

export type PostNode = {
  id: string;
  text: string;
  createdAt: string;
  user: { id: string; first_name: string; last_name: string };
};
