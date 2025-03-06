import { Router } from "express";
import { container } from "../../composition.root";
import { CommentsController } from "./comments.controller";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";

export const commentsRouter = Router();

const commentsController = container.resolve(CommentsController);

commentsRouter.get("/:post_id", authAccessTokenMiddleware, paginationQueryMiddleware, inputCheckErrorsMiddleware, commentsController.getCommentsByPostId.bind(commentsController));

commentsRouter.post("/", authAccessTokenMiddleware, inputCheckErrorsMiddleware, commentsController.createComment.bind(commentsController));
// postsRouter.get("/", authAccessTokenMiddleware, rateLimiterMiddleware, paginationQueryMiddleware, inputCheckErrorsMiddleware, postController.getAllPosts.bind(postController));
// postsRouter.post("/", authAccessTokenMiddleware, inputCheckErrorsMiddleware, postController.createPost.bind(postController));
// postsRouter.put("/:id", postController.updatePost.bind(postController));
// postsRouter.delete("/:id", postController.deletePost.bind(postController));

// usersRouter.get(
//   "/",
//   authAccessTokenMiddleware,
//   paginationQueryMiddleware,
//   sortQueryMiddleware,
//   usersQueryMiddleware,
//   inputCheckErrorsMiddleware,
//   userController.getUsers.bind(userController)
// );
// usersRouter.get("/:id", authAccessTokenMiddleware, findUserMiddleware, userController.getUser.bind(userController));
// usersRouter.put("/edit", authAccessTokenMiddleware, findUserMiddleware, userController.updateUser.bind(userController));

// usersRouter.post("/", adminMiddleware, userBodyValidators, userController.createUser.bind(userController));
// usersRouter.delete("/:id", adminMiddleware, findUserMiddleware, userController.deleteUser.bind(userController));

// usersRouter.post(
//   "/uploadPhoto",
//   authAccessTokenMiddleware,
//   findUserMiddleware,
//   //@ts-ignore
//   savePhotoToStorageMiddleware.single("image"),
//   userController.uploadUserPhoto.bind(userController)
// );
