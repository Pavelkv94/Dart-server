import { body } from "express-validator";
import { hasDateExpired } from "../../../utils/date/hasDateExpired";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";
import { container } from "../../../composition.root";
import { UserQueryRepository } from "../../users/repositories/users.query-repository";

const userQueryRepository = container.resolve(UserQueryRepository);

const code = body("code").custom(async (code) => {
  const user = await userQueryRepository.findUserConfirmationByCode(code);

  if (!user) {
    throw new Error("The requested user was not found or code invalid");
  }

  if (user.confirmationStatus) {
    throw new Error("Email is already confirmed");
  }

  if (hasDateExpired(user.confirmationCodeExpirationDate)) {
    throw new Error("Your activation link is expired. Resend activation email.");
  }
  return true;
});

export const authConfirmBodyValidators = [code, inputCheckErrorsMiddleware];
