import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";
import { container } from "../../../composition.root";
import { UserQueryRepository } from "../../users/repositories/users.query-repository";

const userQueryRepository = container.resolve(UserQueryRepository);

const login = body("login")
  .notEmpty()
  .withMessage("login is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 3, max: 10 })
  .withMessage("must be from 3 to 10 symbols")
  .custom(async (login) => {
    const user = await userQueryRepository.findUserByLogin(login);
    if (user) {
      throw new Error("Login must be unique");
    }
    return true;
  });

const password = body("password")
  .notEmpty()
  .withMessage("password is required")
  .isString()
  .withMessage("not string")
  .isLength({ min: 6, max: 20 })
  .withMessage("must be from 6 to 20 symbols");

const userEmailInputValidator = body("email")
  .isString()
  .withMessage("not string")
  .trim()
  .isEmail()
  .withMessage("Invalid email")
  .custom(async (email) => {
    const user = await userQueryRepository.findUserByEmail(email);
    if (user) {
      throw new Error("Email must be unique");
    }
    return true;
  });

export const authRegistrationBodyValidators = [login, password, userEmailInputValidator, inputCheckErrorsMiddleware];
