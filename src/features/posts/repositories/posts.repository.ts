import { injectable } from "inversify";
import { db } from "../../../db/database";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../../db/database.labels";
import { log } from "console";

@injectable()
export class PostRepository {
  async createPost(post: any) {
    const response = await db.createNode(DatabaseAvailableLabels.POST, post);

    db.connectNodes({
      label1: DatabaseAvailableLabels.USER,
      label2: DatabaseAvailableLabels.POST,
      property1: "id",
      value1: post.user_id,
      property2: "id",
      value2: post.id,
      relation: DatabaseAvailableRelations.USER_POST,
    });
    return response.id;
  }

  async deletePost(post_id: string) {
    const response = await db.runNativeQuery(
      `
      MATCH (p:${DatabaseAvailableLabels.POST} {id: $postId})  
      OPTIONAL MATCH (p)-[r:${DatabaseAvailableRelations.POST_COMMENT}]->(c:${DatabaseAvailableLabels.COMMENT})
      OPTIONAL MATCH (u:${DatabaseAvailableLabels.USER})-[ur:${DatabaseAvailableRelations.USER_COMMENT}]->(c)
      OPTIONAL MATCH (u:${DatabaseAvailableLabels.USER})-[up:${DatabaseAvailableRelations.USER_POST}]->(p)
      DELETE r, c, p, ur, up
      `,
      { postId: post_id }
    );
    return response;
  }
}
