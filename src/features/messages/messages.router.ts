import { Router } from "express";
import { container } from "../../composition.root";
import { MessagesController } from "./messages.controller";
import { authAccessTokenMiddleware } from "../auth/middlewares/auth-accessToken.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";

export const messagesRouter = Router();

const messagesController = container.resolve(MessagesController);

//@ts-ignore
messagesRouter.get("/", authAccessTokenMiddleware, inputCheckErrorsMiddleware, messagesController.getAllMessages.bind(messagesController));
