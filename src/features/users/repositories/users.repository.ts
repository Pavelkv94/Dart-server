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
  async findUserById(id: string): Promise<null> {
    // const userDocument = await UserModel.findOne({ _id: id });
    // if (!userDocument) {
    //   return null;
    // }
    // return userDocument;
    return null;
  }
  async save(user: any): Promise<string> {
    // const result = await user.save();
    // return result.id;
    return "";
  }
  async findConfirmationCodeByUserId(id: string): Promise<string | null> {
    // const userDocument = await UserModel.findOne({ _id: id }).lean();
    // if (!userDocument) {
    // return null;
    // }
    // return userDocument.emailConfirmation.confirmationCode;
    return null;
  }
  async findUserByLoginOrEmail(loginOrEmail: string): Promise<any | null> {
    // const userDocument = await UserModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] }).lean();
    const query = `MATCH (n:${DatabaseAvailableLabels.USER}) WHERE n.email = $loginOrEmail OR n.login = $loginOrEmail RETURN n`;

    const userDocument = await db.findNode(query, {loginOrEmail});
    if (!userDocument) {
      return null;
    }
    return userDocument;
    // const { _id, password } = userDocument;
    // return { id: _id.toString(), password };
  }

  async findUserPassByLoginOrEmail(loginOrEmail: string): Promise<any | null> {
    // const userDocument = await UserModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] }).lean();
    // if (!userDocument) {
    // return null;
    // }
    // const { _id, password } = userDocument;
    // return { id: _id.toString(), password };
    return null;
  }

  async findUserByRecoveryCode(code: string): Promise<string | null> {
    // const userDocument = await UserModel.findOne({ "recoveryConfirmation.recoveryCode": code });

    // if (!userDocument) {
    // return null;
    // }

    // return userDocument.id;
    return null;
  }
  async deleteUser(id: string): Promise<boolean> {
    // const result = await UserModel.deleteOne({ _id: id });
    // return result.deletedCount > 0;
    return false;
  }
}
