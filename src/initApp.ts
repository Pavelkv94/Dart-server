import express from "express";
import cors from "cors";
import { HTTP_STATUSES } from "./types/enums";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { SETTINGS } from "./settings";
import { authRouter } from "./features/auth/auth.router";
import { testingRouter } from "./features/testing/testing.router";
import { usersRouter } from "./features/users/users.router";
import { errorHandlerMiddleware } from "./global-middlewares/error-handler.middleware";
import { securityDevicesRouter } from "./features/securityDevices/securityDevices.router";
import path from "path";
import { postsRouter } from "./features/posts/posts.router";
import { commentsRouter } from "./features/comments/comments.router";
import { messagesRouter } from "./features/messages/messages.router";
import { WebSocketService } from "./adapters/webocket.service";
import { container } from "./composition.root";
import { MessagesRepository } from "./features/messages/repositories/messages.repository";
import { likesRouter } from "./features/likes/likes.router";

export const initApp = () => {
  const app = express();

  config();

  app.set("trust proxy", true);

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.status(HTTP_STATUSES.SUCCESS).json({ version: "1.1" });
  });

  app.use("/storage", express.static(path.join(__dirname, "../storage")));

  app.use(SETTINGS.PATH.AUTH, authRouter);
  app.use(SETTINGS.PATH.MESSAGES, messagesRouter);
  app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.USERS, usersRouter);
  app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
  app.use(SETTINGS.PATH.SECURITY, securityDevicesRouter);
  
  app.use(SETTINGS.PATH.TESTING, testingRouter);
  app.use(SETTINGS.PATH.LIKE, likesRouter);

  app.use(errorHandlerMiddleware);

  new WebSocketService(Number(process.env.WS_PORT), container.get(MessagesRepository));

  return app;
};
