import jwt from "jsonwebtoken";
import { JWTPayloadModel } from "./models/jwt.models";
import { injectable } from "inversify";
import { SETTINGS } from "../../settings";

type JwtPayload = {
  user_id: string;
  device_id: string;
};

@injectable()
export class JwtService {
  async generateTokens(payload: JwtPayload): Promise<any> {
    const accessToken = jwt.sign(payload, SETTINGS.JWT_ACCESS_SECRET, { expiresIn: "50m" });
    const refreshToken = jwt.sign(payload, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: "60m" });
    return {
      accessToken,
      refreshToken,
    };
  }
  async decodeToken(token: string): Promise<any> {
    try {
      return jwt.decode(token);
    } catch (e: unknown) {
      console.error("Can't decode token", e);
      return null;
    }
  }
  async verifyAccessToken(token: string): Promise<{ user_id: string; device_id: string } | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_ACCESS_SECRET) as { user_id: string; device_id: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  }
  async verifyRefreshToken(token: string): Promise<JWTPayloadModel | null> {
    try {
      return jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET) as JWTPayloadModel;
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  }
}
