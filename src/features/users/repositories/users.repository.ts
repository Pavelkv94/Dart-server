import { injectable } from "inversify";
import { db } from "../../../db/database";
import { DatabaseAvailableLabels } from "../../../db/database.labels";
import { UserNode } from "../domain/users.models";

@injectable()
export class UserRepository {
  async create(payload: any): Promise<UserNode> {
    const response = await db.createNode(DatabaseAvailableLabels.USER, payload);

    return response;
  }
  async update(user_id: string, payload: object): Promise<UserNode> {
    const response = await db.updateNodeByField(DatabaseAvailableLabels.USER, { id: user_id }, payload);

    return response;
  }
  async findUserById(id: string): Promise<UserNode | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { id });
    if (!userNode) {
      return null;
    }
    return userNode;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserNode | null> {
    const query = `MATCH (n:${DatabaseAvailableLabels.USER}) WHERE n.email = $loginOrEmail OR n.login = $loginOrEmail RETURN n`;

    const userNode = await db.findNodeWithOptionalParams(query, { loginOrEmail });
    if (!userNode) {
      return null;
    }
    return userNode;
  }

  async findUserByRecoveryCode(code: string): Promise<string | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { recoveryCode: code });
    if (!userNode) {
      return null;
    }
    return userNode.id;
  }
  async markUserAsDeleted(id: string): Promise<void> {
    await db.updateNodeByField(DatabaseAvailableLabels.USER, { id }, { deletedAt: new Date().toISOString() });
  }
}
