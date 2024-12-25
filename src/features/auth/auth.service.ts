import { JwtTokensType, LoginInputModel } from "./models/auth.models";
import { JwtService } from "../../adapters/jwt/jwt.service";
import { randomUUID } from "crypto";
import { BcryptService } from "../../adapters/bcrypt.service";
import { JWTPayloadModel } from "../../adapters/jwt/models/jwt.models";
import { UserService } from "../users/users.service";
import { UserInputModel } from "../users/domain/users.models";
import { UserRepository } from "../users/repositories/users.repository";
import { injectable } from "inversify";
import { SecurityDeviceService } from "../securityDevices/securityDevices.service";
import { db } from "../../db/database";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../db/database.labels";
import { SecurityDeviceRepository } from "../securityDevices/repositories/securityDevices.repository";
import { getExpirationDate } from "../../utils/date/getExpirationDate";

@injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private securityDeviceService: SecurityDeviceService,
    private securityDeviceRepository: SecurityDeviceRepository
  ) {}

  async registration(payload: UserInputModel): Promise<string | null> {
    const user = await this.userService.create(payload);

    return user.confirmationCode;
  }

  async login(user_id: string, ip: string = "", userAgent: string = ""): Promise<JwtTokensType> {
    const tokens = await this.jwtService.generateTokens({ user_id, device_id: randomUUID() });
    const refreshToken: JWTPayloadModel = await this.jwtService.decodeToken(tokens.refreshToken);

    const device = await this.securityDeviceService.addDevice(refreshToken, ip, userAgent);

    db.connectNodes({
      label1: DatabaseAvailableLabels.USER,
      label2: DatabaseAvailableLabels.SECURITY_DEVICE,
      property1: "id",
      value1: user_id,
      property2: "device_id",
      value2: device.device_id,
      relation: DatabaseAvailableRelations.DEVICE,
    });

    return tokens;
  }
  async refresh(ip: string = "", userAgent: string = "", user_id: string, device_id: string): Promise<JwtTokensType> {
    const tokens = await this.jwtService.generateTokens({ user_id, device_id });
    const refreshToken: JWTPayloadModel = await this.jwtService.decodeToken(tokens.refreshToken);
    await this.securityDeviceService.updateDevice(refreshToken, ip, userAgent);

    return tokens;
  }
  async checkRefreshToken(token: string): Promise<{ user_id: string; device_id: string } | null> {
    const payload = await this.jwtService.verifyRefreshToken(token);

    if (!payload) {
      return null;
    }

    const user = await this.userRepository.findUserById(payload.user_id);

    if (!user) {
      return null;
    }

    const isSessionExists = await this.checkSessionVersion(payload);

    if (!isSessionExists) {
      return null;
    }

    return { user_id: payload.user_id, device_id: payload.device_id };
  }
  async checkUserCredentials(payload: LoginInputModel): Promise<string | null> {
    const user = await this.userRepository.findUserByLoginOrEmail(payload.loginOrEmail);

    if (!user) {
      return null;
    }
    const isPasswordValid = await this.bcryptService.checkPassword(payload.password, user.password);

    if (!isPasswordValid) {
      return null;
    }
    return user.id;
  }
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<void> {
    await this.userRepository.update(user_id, { confirmationStatus: status });
  }
  async setNewConfirmCode(user_id: string): Promise<string> {
    const newConfirmationCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const user = await this.userRepository.update(user_id, { confirmationCode: newConfirmationCode, confirmationCodeExpirationDate: newExpirationDate });

    if (!user) {
      throw new Error("Something was wrong");
    }

    return newConfirmationCode;
  }

  async checkSessionVersion(payload: JWTPayloadModel): Promise<boolean> {
    const lastActiveDate = new Date(payload.iat * 1000).toISOString();

    // const result = await SecurityDeviceModel.findOne({ user_id: payload.user_id, device_id: payload.device_id, lastActiveDate: lastActiveDate });
    const result = await this.securityDeviceRepository.findDeviceByVersion(payload.user_id, payload.device_id, lastActiveDate);

    return !!result;
  }
  async setNewRecoveryCode(user_id: string): Promise<string> {
    const newRecoveryCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const user = await this.userRepository.update(user_id, { recoveryCode: newRecoveryCode, recoveryCodeExpirationDate: newExpirationDate });

    if (!user) {
      throw new Error("Something was wrong");
    }

    return newRecoveryCode;
  }

  async setNewPassword(recoveryCode: string, newPassword: string): Promise<boolean> {
    const userId = await this.userRepository.findUserByRecoveryCode(recoveryCode);

    if (!userId) {
      return false;
    }

    await this.userService.updateUserPass(userId, newPassword);
    return true;
  }
}
