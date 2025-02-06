import { randomUUID } from "crypto";
import { BcryptService } from "../../adapters/bcrypt.service";
import { DatabaseAvailableLabels } from "../../db/database.labels";
import { UserInputModel, UserNode } from "./domain/users.models";
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
      deletedAt: null,
      first_name: "",
      last_name: "",
      status: "",
      photo: "",
      background: "",
      country: "",
      birthday: "",
      contacts: [],
      about: "",
      education: "",
      work: "",
      gender: "",
      friends: [],
    };

    const user = await this.userRepository.create(newUser);

    return user;
  }

  async updateUser(user_id: string, payload: UserInputModel): Promise<void> {
    await this.userRepository.update(user_id, payload);
  }
  async updateUserPass(user_id: string, newPass: string): Promise<void> {
    const passwordhash = await this.bcryptService.generateHash(newPass);
    await this.userRepository.update(user_id, { password: passwordhash });
  }
  async deleteUser(id: string): Promise<void> {
    await this.userRepository.markUserAsDeleted(id);
  }
}
