import express from "express";
import cors from "cors";
import { HTTP_STATUSES } from "./types/enums";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { SETTINGS } from "./settings";
import { Database } from "./db/Database.interface";
import { authRouter } from "./features/auth/auth.router";
import { testingRouter } from "./features/testing/testing.router";
import { usersRouter } from "./features/users/users.router";
import { errorHandlerMiddleware } from "./global-middlewares/error-handler.middleware";

// import { SETTINGS } from "./settings";
// import { postsRouter } from "./features/posts/posts.router";
// import { blogsRouter } from "./features/blogs/blogs.router";
// import { usersRouter } from "./features/users/api/users.router";
// import { testingRouter } from "./features/testing/testing.router";
// import { authRouter } from "./features/auth/auth.router";
// import { commentsRouter } from "./features/comments/comments.router";
// import { errorHandlerMiddleware } from "./global-middlewares/error-handler.middleware";
// import { HTTP_STATUSES } from "./types/common-types";
// import cookieParser from "cookie-parser";
// import { securityDevicesRouter } from "./features/securityDevices/securityDevices.router";

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

  //   app.get('/1', async (req, res) => {
  //     try {
  //         // const result = await session.run('MATCH (n:Person) RETURN n LIMIT 20');
  //         // const records = result.records.map((record: any) => record.get('n').properties);
  //         // res.json(records);
  //         // Database.create("User", {name: "Anna", age: 32, car: "audi"})
  //         res.sendStatus(200)
  //     } catch (error) {
  //         console.error(error);
  //         res.status(500).send('Error connecting to the database');
  //     }
  // });

  app.use(SETTINGS.PATH.AUTH, authRouter);
  // app.use(SETTINGS.PATH.BLOGS, blogsRouter);
  // app.use(SETTINGS.PATH.POSTS, postsRouter);
  app.use(SETTINGS.PATH.USERS, usersRouter);
  // app.use(SETTINGS.PATH.COMMENTS, commentsRouter);
  // app.use(SETTINGS.PATH.SECURITY, securityDevicesRouter);

  app.use(SETTINGS.PATH.TESTING, testingRouter);

  app.use(errorHandlerMiddleware);

  return app;
};
