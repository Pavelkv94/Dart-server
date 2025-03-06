import { Router } from "express";
import { container } from "../../composition.root";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { LikesController } from "./likes.controller";

export const likesRouter = Router();

const likesController = container.resolve(LikesController);

likesRouter.put("/", authAccessTokenMiddleware, inputCheckErrorsMiddleware, likesController.like.bind(likesController));
