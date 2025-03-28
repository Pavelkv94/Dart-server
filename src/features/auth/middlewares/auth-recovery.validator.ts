import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";
import { UserQueryRepository } from "../../users/repositories/users.query-repository";
import { container } from "../../../composition.root";
import { hasDateExpired } from "../../../utils/date/hasDateExpired";

const code = body("recoveryCode").custom(async (code) => {
  const userQueryRepository = container.resolve(UserQueryRepository);
  const userNode = await userQueryRepository.findRecoveryByCode(code);

  if (!userNode) {
    throw new Error("The requested user was not found or code invalid");
  }

  if (!userNode.recoveryCodeExpirationDate || hasDateExpired(userNode.recoveryCodeExpirationDate)) {
    throw new Error("Your recovery link is expired. Resend recovery email.");
  }
  return true;
});

const password = body("newPassword")
  .notEmpty()
  .withMessage("password is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 6, max: 20 })
  .withMessage("must be from 6 to 20 symbols");

export const authRecoveryBodyValidators = [password, code, inputCheckErrorsMiddleware];
