import { injectable } from "inversify";
import { db } from "../../../db/database";
import { int } from "neo4j-driver";
import { DatabaseAvailableLabels } from "../../../db/database.labels";

@injectable()
export class CommentsQueryRepository {

  async getCommentsByPostId(post_id: string, page: string, pageSize: string) {
    const skip = Math.floor((Number(page) - 1) * Number(pageSize));
    const limit = Math.floor(Number(pageSize));

    const comments = await db.findNodes("MATCH (n:COMMENT) WHERE n.post_id = $post_id ORDER BY n.createdAt DESC SKIP $skip LIMIT $limit", {
      post_id: post_id,
      skip: int(skip),
      limit: int(limit),
    });
  }

  async getCommentById(comment_id: string) {
    const comment = await db.findNodes("MATCH (n:COMMENT) WHERE n.id = $comment_id RETURN n", {
      comment_id: comment_id,
    });

    return comment;
  }
  // async getAllPosts(page: string, pageSize: string) {
  //   const skip = Math.floor((Number(page) - 1) * Number(pageSize));
  //   const limit = Math.floor(Number(pageSize));

  //   const posts = await db.findNodes("MATCH (n:POST) WHERE n.deletedAt IS NULL ORDER BY n.createdAt DESC SKIP $skip LIMIT $limit MATCH (u:USER) WHERE u.id = n.user_id RETURN n, u", {
  //     skip: int(skip),
  //     limit: int(limit),
  //   });

  //   const postsView = posts.map((p) => ({
  //     ...p.n,
  //     user: { photo: p.u.photo, first_name: p.u.first_name, last_name: p.u.last_name },
  //     likes: [],
  //     comments: [],
  //   }));
    
  //   const countResult = await db.getDefaultNodesCount(DatabaseAvailableLabels.POST, {});

  //   return {
  //     pagesCount: Math.ceil(+countResult.low / +pageSize),
  //     page: +page,
  //     pageSize: +pageSize,
  //     totalCount: +countResult.low,
  //     items: postsView,
  //   };
  // }

  // async getUserPosts(user_id: string, page: string, pageSize: string) {
  //   const skip = Math.floor((Number(page) - 1) * Number(pageSize));
  //   const limit = Math.floor(Number(pageSize));
    
  //   const posts = await db.findNodes("MATCH (n:POST) WHERE n.deletedAt IS NULL AND n.user_id = $user_id ORDER BY n.createdAt DESC RETURN n SKIP $skip LIMIT $limit", {
  //     user_id: user_id,
  //     skip: int(skip),
  //     limit: int(limit),
  //   });

  //   const users = await db.findNodes(
  //     `
  //     MATCH (u:USER)
  //     WHERE u.id = $user_id
  //     RETURN u
  //     `,
  //     {
  //       user_id: user_id,
  //     }
  //   );

  //   const postsView = posts.map((p) => ({
  //     ...p.n,
  //     user: { photo: users[0].u.photo, first_name: users[0].u.first_name, last_name: users[0].u.last_name },
  //     likes: [],
  //     comments: [],
  //   }));

  //   const countResult = await db.findNodesTotalCountWithOptionalQuery(
  //     `
  //     MATCH (n:POST)
  //     WHERE n.deletedAt IS NULL AND n.user_id = $user_id
  //     RETURN COUNT(n) AS totalCount
  //     `,
  //     { user_id: user_id }
  //   );

  //   return {
  //     pagesCount: Math.ceil(+countResult.low / +pageSize),
  //     page: +page,
  //     pageSize: +pageSize,
  //     totalCount: +countResult.low,
  //     items: postsView,
  //   };
  // }

  // async getPostById(post_id: string) {
  //   const post = await db.findNodes("MATCH (n:POST) WHERE n.deletedAt IS NULL AND n.id = $post_id RETURN n", {
  //     post_id: post_id,
  //   });

  //   const user = await db.findNodes(
  //     `
  //     MATCH (u:USER)
  //     WHERE u.id = $user_id
  //     RETURN u
  //     `,
  //     {
  //       user_id: post[0].n.user_id,
  //     }
  //   );

  //   const postView = {
  //     ...post[0].n,
  //     user: { photo: user[0].u.photo, first_name: user[0].u.first_name, last_name: user[0].u.last_name },
  //     likes: [],
  //     comments: [],
  //   };

  //   return postView;
  // }
}
