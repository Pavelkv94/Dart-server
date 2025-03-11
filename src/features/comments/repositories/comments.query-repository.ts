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
}
