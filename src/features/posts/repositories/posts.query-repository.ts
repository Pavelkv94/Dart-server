import { injectable } from "inversify";
import { db } from "../../../db/database";
import { int } from "neo4j-driver";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../../db/database.labels";

@injectable()
export class PostQueryRepository {
  async getAllPosts(page: string, pageSize: string) {
    const skip = Math.floor((Number(page) - 1) * Number(pageSize));
    const limit = Math.floor(Number(pageSize));

    const posts = await db.findNodes(
      "MATCH (n:POST) WHERE n.deletedAt IS NULL ORDER BY n.createdAt DESC SKIP $skip LIMIT $limit MATCH (u:USER) WHERE u.id = n.user_id RETURN n, u",
      {
        skip: int(skip),
        limit: int(limit),
      }
    );

    const postsView = await this._getPostView(posts);

    const countResult = await db.getDefaultNodesCount(DatabaseAvailableLabels.POST, {});

    return {
      pagesCount: Math.ceil(+countResult.low / +pageSize),
      page: +page,
      pageSize: +pageSize,
      totalCount: +countResult.low,
      items: postsView,
    };
  }

  async getUserPosts(user_id: string, page: string, pageSize: string) {
    const skip = Math.floor((Number(page) - 1) * Number(pageSize));
    const limit = Math.floor(Number(pageSize));

    const posts = await db.findNodes(
      "MATCH (n:POST) WHERE n.deletedAt IS NULL AND n.user_id = $user_id ORDER BY n.createdAt DESC RETURN n SKIP $skip LIMIT $limit",
      {
        user_id: user_id,
        skip: int(skip),
        limit: int(limit),
      }
    );

    const users = await db.findNodes(
      `
      MATCH (u:USER)
      WHERE u.id = $user_id
      RETURN u
      `,
      {
        user_id: user_id,
      }
    );

    const postsView = await this._getPostView(posts, users[0].u);

    const countResult = await db.findNodesTotalCountWithOptionalQuery(
      `
      MATCH (n:POST)
      WHERE n.deletedAt IS NULL AND n.user_id = $user_id
      RETURN COUNT(n) AS totalCount
      `,
      { user_id: user_id }
    );

    return {
      pagesCount: Math.ceil(+countResult.low / +pageSize),
      page: +page,
      pageSize: +pageSize,
      totalCount: +countResult.low,
      items: postsView,
    };
  }

  async getPostById(post_id: string) {
    const post = await db.findNodes("MATCH (n:POST) WHERE n.deletedAt IS NULL AND n.id = $post_id RETURN n", {
      post_id: post_id,
    });

    const user = await db.findNodes(
      `
      MATCH (u:USER)
      WHERE u.id = $user_id
      RETURN u
      `,
      {
        user_id: post[0].n.user_id,
      }
    );

    const postView = {
      ...post[0].n,
      user: { photo: user[0].u.photo, first_name: user[0].u.first_name, last_name: user[0].u.last_name },
      likes: [],
      comments: [],
    };

    return postView;
  }

  async _getPostView(posts: any[], userInfo?: any) {
    return Promise.all(
      posts.map(async (p) => {
        // If userInfo is provided, use it; otherwise, use p.u (for getAllPosts)

        const user = userInfo || p.u;

        const comments = await db.findNodes(
          `
          MATCH (p:${DatabaseAvailableLabels.POST})-[:${DatabaseAvailableRelations.POST_COMMENT}]->(c:${DatabaseAvailableLabels.COMMENT})
          WHERE p.id = $postId
          RETURN c
          `,
          { postId: p.n.id }
        );

        const commentPromises = await Promise.all(
          comments.map(async (c) => {
            const users = await db.findNodes(
              `
              MATCH (u:USER)
              WHERE u.id = $user_id
              RETURN u
              `,
              {
                user_id: c.c.commentator_id,
              }
            );

            const commentLikes = await db.findNodes(
              `
              MATCH (p:${DatabaseAvailableLabels.COMMENT} {id: $commentId})-[:${DatabaseAvailableRelations.COMMENT_LIKE}]->(l:${DatabaseAvailableLabels.LIKE})
              RETURN l
              `,
              { commentId: c.c.id }
            );

            return {
              ...c.c,
              user: { photo: users[0].u.photo, first_name: users[0].u.first_name, last_name: users[0].u.last_name },
              likesCount: commentLikes.filter((l) => l.l.like_status === "Like").length,
              isILiked: commentLikes.filter((l) => l.l.like_status === "Like" && l.l.user_id === user.id).length > 0,
            };
          })
        );

        const postLikes = await db.findNodes(
          `
          MATCH (p:${DatabaseAvailableLabels.POST} {id: $postId})-[:${DatabaseAvailableRelations.POST_LIKE}]->(l:${DatabaseAvailableLabels.LIKE})
          RETURN l
          `,
          { postId: p.n.id }
        );

        return {
          ...p.n,
          user: { photo: user.photo, first_name: user.first_name, last_name: user.last_name },
          comments: commentPromises,
          likesCount: postLikes.filter((l) => l.l.like_status === "Like").length,
          isILiked: postLikes.filter((l) => l.l.like_status === "Like" && l.l.user_id === user.id).length > 0,
        };
      })
    );
  }
}
