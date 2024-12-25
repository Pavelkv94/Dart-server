import { injectable } from "inversify";
import { JWTPayloadModel } from "../../adapters/jwt/models/jwt.models";
import { ResultObject } from "../../types/common-types";
import { ResultStatus } from "../../types/enums";
import { SecurityDeviceRepository } from "./repositories/securityDevices.repository";
import { randomUUID } from "crypto";
@injectable()
export class SecurityDeviceService {
  constructor(private securityDeviceRepository: SecurityDeviceRepository) {}
  async addDevice(refreshToken: JWTPayloadModel, ip: string, userAgent: string): Promise<any> {
    const newDevice = {
      device_id: refreshToken.device_id,
      user_id: refreshToken.user_id,
      lastActiveDate: new Date(refreshToken.iat * 1000).toISOString(),
      expirationDate: refreshToken.exp,
      title: userAgent,
      ip: ip,
    };

    const device_id = await this.securityDeviceRepository.addDevice(newDevice);

    return device_id;
  }

  async updateDevice(refreshToken: JWTPayloadModel, ip: string, userAgent: string): Promise<void> {
    const payload = {
      // device_id: refreshToken.device_id,
      user_id: refreshToken.user_id,
      lastActiveDate: new Date(refreshToken.iat * 1000).toISOString(),
      expirationDate: refreshToken.exp,
      title: userAgent,
      ip: ip,
    };
    await this.securityDeviceRepository.updateDevice(refreshToken.device_id, payload);
  }

  async deleteOtherSecurityDevices(user_id: string, device_id: string): Promise<void> {
    await this.securityDeviceRepository.deleteOtherSecurityDevices(user_id, device_id);
  }
  async deleteSecurityDevice(device_id: string, user_id: string): Promise<ResultObject<boolean | null>> {
    const deviceNode = await this.securityDeviceRepository.findDeviceById(device_id);

    const isOwner = deviceNode?.user_id === user_id;
    if (!isOwner) {
      return {
        status: ResultStatus.FORBIDDEN,
        errorMessage: "Access forbidden",
        data: null,
      };
    }
    await this.securityDeviceRepository.deleteDevice(device_id, user_id);
    return {
      status: ResultStatus.SUCCESS,
      data: null,
    };
  }
}
