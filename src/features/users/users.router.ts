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
import { upload } from "./middlewares/upload.middleware";
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
usersRouter.get("/:id", authAccessTokenMiddleware, findUserMiddleware, userController.getUser.bind(userController));
usersRouter.put("/edit", authAccessTokenMiddleware, findUserMiddleware, userController.updateUser.bind(userController));

usersRouter.post("/", adminMiddleware, userBodyValidators, userController.createUser.bind(userController));
usersRouter.delete("/:id", adminMiddleware, findUserMiddleware, userController.deleteUser.bind(userController));

usersRouter.post(
  "/uploadPhoto",
  authAccessTokenMiddleware,
  findUserMiddleware,
  upload.single("file"),
  userController.uploadUserPhoto.bind(userController)
);

usersRouter.post(
  "/uploadBackground",
  authAccessTokenMiddleware,
  findUserMiddleware,
  upload.single("file"),
  userController.uploadUserBackground.bind(userController)
);


usersRouter.post("/set-contact-action", authAccessTokenMiddleware, userController.setContactAction.bind(userController));
