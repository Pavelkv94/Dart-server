import { injectable } from "inversify";
import { db } from "../../../db/database";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../../db/database.labels";

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

    return response;
  }
}
