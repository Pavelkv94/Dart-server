export type TokenEntityModel = {
  token: string;
};

export type JWTPayloadModel = {
  user_id: string;
  device_id: string;
  iat: number;
  exp: number;
};
