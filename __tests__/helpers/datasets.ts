import { fromUTF8ToBase64 } from "../../src/global-middlewares/admin.middleware";
import { SETTINGS } from "../../src/settings";

export const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN);

export const mockCreateUserDto = {
  login: "admin",
  password: "qwerty",
  email: "admin@admin.com",
};
