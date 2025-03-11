import { injectable } from "inversify";
import { db } from "../../db/database";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../db/database.labels";
import { randomUUID } from "crypto";
import { LikeParentType } from "./likes.models";

interface LikeInput {
  user_id: string;
  parent_id: string;
  parent_type: LikeParentType;
}

@injectable()
export class LikesRepository {
  constructor() {}

  async like(likeInput: LikeInput) {
    const { parent_type, user_id, parent_id } = likeInput;
    const like = await this.doesLikeExist(parent_type, user_id, parent_id);

    if (like) {
      await this.toggleLikeStatus(like.id, like.like_status);
      return;
    }

    const newLike = await this.createLike(likeInput);
    await this.createLikeConnections(newLike, parent_type);
  }

  private async toggleLikeStatus(likeId: string, currentStatus: string) {
    return db.runNativeQuery(
      `
      MATCH (l:${DatabaseAvailableLabels.LIKE} {id: $likeId})
      SET l.like_status = $status
      `,
      { likeId, status: currentStatus === "Like" ? "None" : "Like" }
    );
  }

  private async createLike(likeInput: LikeInput) {
    return db.createNode(DatabaseAvailableLabels.LIKE, {
      ...likeInput,
      id: randomUUID(),
      like_status: "Like"
    });
  }

  private async createLikeConnections(like: any, parentType: LikeParentType) {
    // Create user-like connection
    await db.connectNodes({
      label1: DatabaseAvailableLabels.USER,
      label2: DatabaseAvailableLabels.LIKE,
      property1: "id",
      value1: like.user_id,
      property2: "id",
      value2: like.id,
      relation: DatabaseAvailableRelations.USER_LIKE,
    });

    // Create parent-like connection
    const parentLabel = parentType === LikeParentType.Post 
      ? DatabaseAvailableLabels.POST 
      : DatabaseAvailableLabels.COMMENT;
    
    const parentRelation = parentType === LikeParentType.Post
      ? DatabaseAvailableRelations.POST_LIKE
      : DatabaseAvailableRelations.COMMENT_LIKE;

    await db.connectNodes({
      label1: parentLabel,
      label2: DatabaseAvailableLabels.LIKE,
      property1: "id",
      value1: like.parent_id,
      property2: "id",
      value2: like.id,
      relation: parentRelation,
    });
  }

  private async doesLikeExist(parentType: LikeParentType, userId: string, parentId: string) {
    const parentLabel = parentType === LikeParentType.Post 
      ? DatabaseAvailableLabels.POST 
      : DatabaseAvailableLabels.COMMENT;
    
    const userRelation = parentType === LikeParentType.Post
      ? DatabaseAvailableRelations.USER_POST
      : DatabaseAvailableRelations.USER_COMMENT;
    
    const likeRelation = parentType === LikeParentType.Post
      ? DatabaseAvailableRelations.POST_LIKE
      : DatabaseAvailableRelations.COMMENT_LIKE;

    const query = `
      MATCH (u:${DatabaseAvailableLabels.USER} {id: $userId})-[:${userRelation}]->(p:${parentLabel} {id: $parentId})
      RETURN p
    `;

    const parent = await db.findNodes(query, { userId, parentId });

    if (!parent.length) return null;

    const like = await db.findNodes(
      `
      MATCH (p:${parentLabel} {id: $parentId})-[:${likeRelation}]->(l:${DatabaseAvailableLabels.LIKE})
      RETURN l
      `,
      { parentId }
    );

    return like.length > 0 ? like[0].l : null;
  }
}
