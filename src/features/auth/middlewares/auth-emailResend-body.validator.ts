import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";
import { UserQueryRepository } from "../../users/repositories/users.query-repository";
import { container } from "../../../composition.root";

const userQueryRepository = container.resolve(UserQueryRepository);

const userEmailInputValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .isEmail()
  .withMessage("Invalid email")
  .custom(async (email) => {
    const userNode = await userQueryRepository.findEmailConfirmationByEmail(email);

    if (!userNode) {
      throw new Error("User not exist");
    }

    if (userNode.confirmationStatus as boolean) {
      throw new Error("Email is already confirmed");
    }
    return true;
  });

export const authEmailResendBodyValidators = [userEmailInputValidator, inputCheckErrorsMiddleware];
