import { randomUUID } from "crypto";
import { BcryptService } from "../../adapters/bcrypt.service";
import { db } from "../../db/database";
import { DatabaseAvailableLabels } from "../../db/database.labels";
import { UserInputModel, UserNode } from "./domain/users.models";
// import { UserInputModel } from "../domain/users.models";
// import { UserModel } from "../domain/User.entity";
import { injectable } from "inversify";
import { UserRepository } from "./repositories/users.repository";
import { getExpirationDate } from "../../utils/date/getExpirationDate";

@injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private bcryptService: BcryptService) {}

  async findUser(user_id: string): Promise<string | null> {
    const user = await this.userRepository.findUserById(user_id);

    // return user ? user.id : null;
    return null;
  }
  async create(payload: UserInputModel): Promise<UserNode> {
    const passwordhash = await this.bcryptService.generateHash(payload.password);

    const newUser = {
      login: payload.login,
      email: payload.email,
      password: passwordhash,
      createdAt: new Date().toISOString(),
      confirmationCode: randomUUID(),
      confirmationStatus: false,
      confirmationCodeExpirationDate: getExpirationDate(30),
      recoveryCode: "",
      recoveryCodeExpirationDate: "",
      name: DatabaseAvailableLabels.USER,
      id: randomUUID(),
    };

    const user = await this.userRepository.create(newUser);

    return user;
  }
  async updateUserPass(user_id: string, newPass: string): Promise<void> {
    const passwordhash = await this.bcryptService.generateHash(newPass);
    await this.userRepository.update(user_id, { password: passwordhash });
  }
  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await this.userRepository.deleteUser(id);
    return isDeleted;
  }
}
