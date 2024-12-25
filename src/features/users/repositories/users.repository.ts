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
    const userDocument = await db.findNodeByField(DatabaseAvailableLabels.USER, { id });
    if (!userDocument) {
      return null;
    }
    return userDocument;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserNode | null> {
    const query = `MATCH (n:${DatabaseAvailableLabels.USER}) WHERE n.email = $loginOrEmail OR n.login = $loginOrEmail RETURN n`;

    const userDocument = await db.findNodeWithOptionalParams(query, { loginOrEmail });
    if (!userDocument) {
      return null;
    }
    return userDocument;
  }

  async findUserByRecoveryCode(code: string): Promise<string | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { recoveryCode: code });
    if (!userNode) {
      return null;
    }
    return userNode.id;
  }
  async deleteUser(id: string): Promise<boolean> {
    // const result = await UserModel.deleteOne({ _id: id });
    // return result.deletedCount > 0;
    return false;
  }
}
