import { randomUUID } from "crypto";
import { BcryptService } from "../../adapters/bcrypt.service";
import { DatabaseAvailableLabels } from "../../db/database.labels";
import { ContactInputModel, UserInputModel, UserNode } from "./domain/users.models";
import { injectable } from "inversify";
import { UserRepository } from "./repositories/users.repository";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { UserViewDto } from "./repositories/dto";
import sharp from "sharp";
import { StorageService } from "../../adapters/storage.service";
// import { FileSaverService } from "../../adapters/fileSaver.service";

@injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private bcryptService: BcryptService, private storageService: StorageService) { }

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
      first_name: "John",
      last_name: "Doe",
      status: "",
      photo: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
      background: "https://pngmagic.com/product_images/orange-curve-neutral-abstract-background.jpg",
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

  async updateUser(user_id: string, payload: any): Promise<void> {
    await this.userRepository.update(user_id, payload);
  }
  async updateUserPass(user_id: string, newPass: string): Promise<void> {
    const passwordhash = await this.bcryptService.generateHash(newPass);
    await this.userRepository.update(user_id, { password: passwordhash });
  }

  async uploadUserPhoto(user: UserViewDto, file: Express.Multer.File): Promise<string> {
    const buffer = await file.buffer;

    const filename = `avatars/${user.login}.webp`;

    if (file.filename && file.mimetype.endsWith('gif')) {
      const image = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer();
      await this.storageService.uploadFile(image, filename, 'image/webp');
    } else {
      const image = await sharp(buffer, { animated: true }).resize(512, 512).webp().toBuffer();
      await this.storageService.uploadFile(image, filename, 'image/webp');
    }

    await this.userRepository.update(user.id, { photo: filename });

    return filename
  }

  async uploadUserBackground(user: UserViewDto, file: Express.Multer.File): Promise<string> {
    const buffer = await file.buffer;
    const filename = `backgrounds/${user.login}.webp`;
    await this.storageService.uploadFile(buffer, filename, 'image/webp');
    await this.userRepository.update(user.id, { background: filename });
    return filename
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.markUserAsDeleted(id);
  }

  async setContactAction(user_id: string, actionBody: ContactInputModel): Promise<void> {
    await this.userRepository.setContactAction(user_id, actionBody);
  }
}
