import { injectable } from "inversify";
import { db } from "../../../db/database";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../../db/database.labels";
import { log } from "console";

@injectable()
export class CommentsRepository {
  async createComment(comment: any) {
    const response = await db.createNode(DatabaseAvailableLabels.COMMENT, comment);

    db.connectNodes({
      label1: DatabaseAvailableLabels.USER,
      label2: DatabaseAvailableLabels.COMMENT,
      property1: "id",
      value1: comment.commentator_id,
      property2: "id",
      value2: comment.id,
      relation: DatabaseAvailableRelations.USER_COMMENT,
    });

    db.connectNodes({
      label1: DatabaseAvailableLabels.POST,
      label2: DatabaseAvailableLabels.COMMENT,
      property1: "id",
      value1: comment.post_id,
      property2: "id",
      value2: comment.id,
      relation: DatabaseAvailableRelations.POST_COMMENT,
    });

    return response.id;
  }

  // async createPost(post: any) {

  //   const response = await db.createNode(DatabaseAvailableLabels.POST, post);

  //   db.connectNodes({
  //       label1: DatabaseAvailableLabels.USER,
  //       label2: DatabaseAvailableLabels.POST,
  //       property1: "id",
  //       value1: post.user_id,
  //       property2: "id",
  //       value2: post.id,
  //       relation: DatabaseAvailableRelations.USER_POST,
  //     });
  //   return response.id;
  // }
}
