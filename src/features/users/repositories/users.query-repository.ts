import { injectable } from "inversify";
import { UserNode, UsersValidInputQueryModel } from "../domain/users.models";
import { DatabaseAvailableLabels } from "../../../db/database.labels";
import { db } from "../../../db/database";

@injectable()
export class UserQueryRepository {
  async findAllUsers(query: UsersValidInputQueryModel): Promise<any> {
    // const { pageSize, pageNumber, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = query;

    // let filter: any = {
    //   $or: [],
    // };

    // if (searchLoginTerm) {
    //   filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    // }
    // if (searchEmailTerm) {
    //   filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    // }

    // if (filter.$or.length === 0) {
    //   filter = {};
    // }

    // const usersFromDb = await UserModel.find(filter)
    //   .skip((pageNumber - 1) * pageSize)
    //   .limit(pageSize)
    //   .sort({ [sortBy]: sortDirection });

    // const usersView = UserViewDto.mapToViewArray(usersFromDb);

    // const usersCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm);

    // return {
    //   pagesCount: Math.ceil(usersCount / query.pageSize),
    //   page: query.pageNumber,
    //   pageSize: query.pageSize,
    //   totalCount: usersCount,
    //   items: usersView,
    // };
    return "users";
  }
  async getUsersCount(searchLoginTerm: string, searchEmailTerm: string): Promise<any> {
    // let filter: any = {
    //   $or: [],
    // };
    // if (searchLoginTerm) {
    //   filter.$or.push({ login: { $regex: searchLoginTerm, $options: "i" } });
    // }
    // if (searchEmailTerm) {
    //   filter.$or.push({ email: { $regex: searchEmailTerm, $options: "i" } });
    // }
    // if (filter.$or.length === 0) {
    //   filter = {};
    // }
    // return UserModel.countDocuments(filter);
  }
  async findUserById(id: string): Promise<UserNode | null> {
    const userDocument = await db.findNodeByField(DatabaseAvailableLabels.USER, { id });
    if (!userDocument) {
      return null;
    }
    return userDocument;
  }

  async findUserByLogin(login: string): Promise<any | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { login });
    if (!userNode) {
      return null;
    }
    return userNode;
  }

  async findUserByEmail(email: string): Promise<any | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { email });
    if (!userNode) {
      return null;
    }
    return userNode;
  }

  async findUserByConfirmationCode(code: string): Promise<any> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { confirmationCode: code });
    if (!userNode) {
      return null;
    }
    return userNode;
  }
  async findUserConfirmationByCode(code: string): Promise<UserNode | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { confirmationCode: code });
    if (!userNode) {
      return null;
    }
    return userNode;
  }
  async findEmailConfirmationByEmail(email: string): Promise<boolean | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { email });
    if (!userNode) {
      return null;
    }
    return userNode.confirmationStatus;
  }
  async findRecoveryByCode(code: string): Promise<any> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { recoveryCode: code });
    if (!userNode) {
      return null;
    }
    return userNode;
  }
}
