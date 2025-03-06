import { injectable } from "inversify";
import { UserNode, UsersValidInputQueryModel } from "../domain/users.models";
import { DatabaseAvailableLabels } from "../../../db/database.labels";
import { db } from "../../../db/database";
import { UserViewDto } from "./dto";

@injectable()
export class UserQueryRepository {
  async findAllUsers(query: UsersValidInputQueryModel, user_id: string): Promise<any> {
    
    const { pageSize, pageNumber, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = query;
    // const users = await db.findNodes("MATCH (n:USER) WHERE n.deletedAt IS NULL AND n.id <> $userId OPTIONAL MATCH (n)-[r:FRIEND]->(f:USER {id: $userId}) RETURN n, r", {
    //   userId: user_id,
    // });

    const users = await db.findNodesWithRelation(`
      MATCH (cu:USER {id: $userId})
      MATCH (n:USER)
      WHERE n.deletedAt IS NULL AND n.id <> $userId
      OPTIONAL MATCH (cu)-[r:FRIEND]-(n)
      RETURN n, CASE WHEN r IS NOT NULL THEN true ELSE false END AS isFriend
      `, {
      userId: user_id,
    });

    
    const usersCount = await db.getDefaultNodesCount(DatabaseAvailableLabels.USER, {});

    // return users;
    // let filter: any = {
    //   $or: [],
    // };usersCount

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

    return {
      pagesCount: Math.ceil(usersCount.low / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: usersCount.low,
      items: users.map((user) => UserViewDto.mapToView(user.n, user.isFriend)),
    };
  }

  async findUserById(id: string): Promise<UserViewDto | null> {
    const userDocument = await db.findNodeByField(DatabaseAvailableLabels.USER, { id });
    if (!userDocument) {
      return null;
    }
    return UserViewDto.mapToView(userDocument, false); // TODO: add isFriend
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
  async findEmailConfirmationByEmail(email: string): Promise<UserNode | null> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { email });
    if (!userNode) {
      return null;
    }
    return userNode;
  }
  async findRecoveryByCode(code: string): Promise<any> {
    const userNode = await db.findNodeByField(DatabaseAvailableLabels.USER, { recoveryCode: code });
    if (!userNode) {
      return null;
    }
    return userNode;
  }
}
