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
      deviceId: refreshToken.deviceId,
      user_id: refreshToken.user_id,
      lastActiveDate: new Date(refreshToken.iat * 1000).toISOString(),
      expirationDate: refreshToken.exp,
      title: userAgent,
      ip: ip,
    };

    const deviceId = await this.securityDeviceRepository.addDevice(newDevice);

    return deviceId;
  }
//   async updateDevice(refreshToken: JWTPayloadModel, ip: string, userAgent: string): Promise<boolean> {
//     const newDevice = {
//       deviceId: refreshToken.deviceId,
//       user_id: refreshToken.user_id,
//       lastActiveDate: new Date(refreshToken.iat * 1000).toISOString(),
//       expirationDate: refreshToken.exp,
//       title: userAgent,
//       ip: ip,
//     };

//     const isUpdated = await this.securityDeviceRepository.updateDevice(newDevice);
//     return isUpdated;
//   }
//   async deleteOtherSecurityDevices(user_id: string, deviceId: string): Promise<boolean> {
//     const isDeleted = await this.securityDeviceRepository.deleteDevices(user_id, deviceId);

//     return isDeleted;
//   }
//   async deleteSecurityDevice(deviceId: string, user_id: string): Promise<ResultObject<boolean | null>> {
//     const deviceOwnerId = await this.securityDeviceRepository.findDevice(deviceId);

//     const isOwner = deviceOwnerId === user_id;

//     if (!isOwner) {
//       return {
//         status: ResultStatus.FORBIDDEN,
//         errorMessage: "Access forbidden",
//         data: null,
//       };
//     }
//     const isDeleted = await this.securityDeviceRepository.deleteDevice(deviceId, user_id);
//     return {
//       status: isDeleted ? ResultStatus.SUCCESS : ResultStatus.FORBIDDEN,
//       data: isDeleted,
//     };
//   }
}
