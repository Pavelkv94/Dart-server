import { Router } from "express";
import { container } from "../../composition.root";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { usersQueryMiddleware } from "./middlewares/users-query.middleware";
import { UserController } from "./users.controller";
import { userBodyValidators } from "./middlewares/user-body.validator";
import { findUserMiddleware } from "./middlewares/findUser.middleware";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";

export const usersRouter = Router();

const userController = container.resolve(UserController);

usersRouter.get(
  "/",
  authAccessTokenMiddleware,
  paginationQueryMiddleware,
  sortQueryMiddleware,
  usersQueryMiddleware,
  inputCheckErrorsMiddleware,
  userController.getUsers.bind(userController)
);
usersRouter.post("/", authAccessTokenMiddleware, userBodyValidators, userController.createUser.bind(userController));
usersRouter.delete("/:id", authAccessTokenMiddleware, findUserMiddleware, userController.deleteUser.bind(userController));
