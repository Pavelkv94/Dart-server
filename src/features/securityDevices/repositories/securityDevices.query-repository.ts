// import { DeviceViewDto } from "./dto";
import { DeviceViewModel } from "../models/securityDevices.model";
import { injectable } from "inversify";
import { db } from "../../../db/database";
import { DatabaseAvailableLabels } from "../../../db/database.labels";
import { DeviceViewDto } from "./dto";

@injectable()
export class SecurityDeviceQueryRepository {
  async findDevice(device_id: string): Promise<boolean> {
    const deviceFromDb = await db.findNodeByField(DatabaseAvailableLabels.SECURITY_DEVICE, { device_id });
    return deviceFromDb;
  }
  async findSecurityDevices(user_id: string): Promise<any[]> {
    const deviceNodes = await db.findNodeByField(DatabaseAvailableLabels.SECURITY_DEVICE, { user_id });

    return deviceNodes?.map((node: any) => DeviceViewDto.mapToView(node));
  }
}
