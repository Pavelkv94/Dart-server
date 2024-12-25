import { injectable } from "inversify";
// import { SecurityDeviceModel } from "../../../db/models/SecurityDevice.model";
import { DeviceCreateDto, DeviceNode, DeviceUpdateDto } from "../models/securityDevices.model";
import { db } from "../../../db/database";
import { DatabaseAvailableLabels } from "../../../db/database.labels";
@injectable()
export class SecurityDeviceRepository {
  async findDeviceById(device_id: string): Promise<DeviceNode | null> {
    const query = `MATCH (n:${DatabaseAvailableLabels.SECURITY_DEVICE}) WHERE n.device_id = $device_id RETURN n`;

    const deviceNode = await db.findNodeByField(DatabaseAvailableLabels.SECURITY_DEVICE, { device_id });
    if (!deviceNode) {
      return null;
    }
    return deviceNode;
  }
  async findDeviceByVersion(user_id: string, device_id: string, lastActiveDate: string): Promise<any> {
    const query = `MATCH (n:${DatabaseAvailableLabels.SECURITY_DEVICE}) WHERE n.user_id = $user_id AND n.device_id = $device_id AND n.lastActiveDate = $lastActiveDate RETURN n`;

    const userDocument = await db.findNodeWithOptionalParams(query, { user_id, device_id, lastActiveDate });
    if (!userDocument) {
      return null;
    }
    return userDocument;
  }

  async addDevice(payload: DeviceCreateDto): Promise<string> {
    const response = await db.createNode(DatabaseAvailableLabels.SECURITY_DEVICE, payload);

    return response;
  }
  async updateDevice(device_id: string, payload: DeviceUpdateDto): Promise<boolean> {
    const deviceNode = await db.updateNodeByField(DatabaseAvailableLabels.SECURITY_DEVICE, { device_id }, payload);

    return deviceNode;
  }

  async deleteOtherSecurityDevices(user_id: string, device_id: string): Promise<void> {
    const query = `MATCH (n:${DatabaseAvailableLabels.SECURITY_DEVICE})
      WHERE n.user_id = $user_id AND n.device_id <> $device_id
      DETACH DELETE n`;
    await db.deleteNode(query, { device_id, user_id });
  }
  async deleteDevice(device_id: string, user_id: string): Promise<void> {
    const query = `MATCH (n:${DatabaseAvailableLabels.SECURITY_DEVICE}) WHERE n.user_id = $user_id AND n.device_id = $device_id DETACH DELETE n`;

    await db.deleteNode(query, { device_id, user_id });
  }
}
