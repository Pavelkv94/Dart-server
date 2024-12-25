import { DeviceNode, DeviceViewModel } from "../models/securityDevices.model";

export class DeviceViewDto {
  title: string;
  ip: string;
  device_id: string;
  lastActiveDate: string;

  constructor(model: DeviceNode) {
    this.title = model.title;
    this.ip = model.ip;
    this.device_id = model.device_id;
    this.lastActiveDate = model.lastActiveDate;
  }

  static mapToView(post: DeviceNode): DeviceViewModel {
    return new DeviceViewDto(post);
  }
}
