import { ConfirmationInputModel, EmailResendInputModel, LoginInputModel, RecoveryPasswordInputModel } from "../../src/features/auth/models/auth.models";
import { UserInputModel } from "../../src/features/users/domain/users.models";
import { SETTINGS } from "../../src/settings";
import { HTTP_STATUSES } from "../../src/types/enums";
import { codedAuth } from "./datasets";
import { req } from "./initApp.helper";

export const authManager = {
  async loginUser(payload: LoginInputModel, status: HTTP_STATUSES = HTTP_STATUSES.SUCCESS) {
    const response = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(payload).expect(status);

    return response;
  },

  async registerUser(payload: UserInputModel, status: HTTP_STATUSES = HTTP_STATUSES.NO_CONTENT) {
    const response = await req.post(`${SETTINGS.PATH.AUTH}/registration`).send(payload).expect(status);

    return response;
  },

  async confirmation(payload: ConfirmationInputModel, status: HTTP_STATUSES = HTTP_STATUSES.NO_CONTENT) {
    const response = await req.post(`${SETTINGS.PATH.AUTH}/registration-confirmation`).send(payload).expect(status);

    return response;
  },

  async resendEmail(payload: EmailResendInputModel, status: HTTP_STATUSES = HTTP_STATUSES.NO_CONTENT) {
    const response = await req.post(`${SETTINGS.PATH.AUTH}/registration-email-resending`).send(payload).expect(status);

    return response;
  },

  async logout(refreshToken: string, status: HTTP_STATUSES = HTTP_STATUSES.NO_CONTENT) {
    const response = await req
      .post(`${SETTINGS.PATH.AUTH}/logout`)
      .set("Cookie", [`refreshToken=${refreshToken}`])
      .expect(status);

    return response;
  },

  async passwordRecovery(payload: EmailResendInputModel, status: HTTP_STATUSES = HTTP_STATUSES.NO_CONTENT) {
    const response = await req.post(`${SETTINGS.PATH.AUTH}/password-recovery`).send(payload).expect(status);

    return response;
  },

  async setNewPassword(payload: RecoveryPasswordInputModel, status: HTTP_STATUSES = HTTP_STATUSES.NO_CONTENT) {
    const response = await req.post(`${SETTINGS.PATH.AUTH}/new-password`).send(payload).expect(status);

    return response;
  },
};
