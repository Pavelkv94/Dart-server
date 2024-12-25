export type DeviceUpdateDto = {
  title: string;
  expirationDate: number;
  ip: string;
  lastActiveDate: string;
  user_id: string;
};

export type DeviceCreateDto = DeviceUpdateDto & {
  device_id: string;
};

export type DeviceViewModel = {
  title: string;
  ip: string;
  device_id: string;
  lastActiveDate: string;
};

export type URIParamsDeviceModel = {
  id: string;
};

export type DeviceNode = {
  device_id: string;
  user_id: string;
  ip: string;
  lastActiveDate: string;
  title: string;
  expirationDate: number;
};
