import { Container } from "inversify";
import "reflect-metadata";
import { JwtService } from "./adapters/jwt/jwt.service";
import { BcryptService } from "./adapters/bcrypt.service";
import { NodemailerService } from "./adapters/mail.service";
import { UserService } from "./features/users/users.service";
import { UserQueryRepository } from "./features/users/repositories/users.query-repository";
import { UserRepository } from "./features/users/repositories/users.repository";
import { AuthController } from "./features/auth/auth.controller";
import { AuthService } from "./features/auth/auth.service";
import { UserController } from "./features/users/users.controller";
import { SecurityDeviceRepository } from "./features/securityDevices/repositories/securityDevices.repository";
import { SecurityDeviceService } from "./features/securityDevices/securityDevices.service";
import { SecurityDeviceQueryRepository } from "./features/securityDevices/repositories/securityDevices.query-repository";
import { SecurityDeviceController } from "./features/securityDevices/securityDevices.controller";
import { PostService } from "./features/posts/posts.service";
import { PostRepository } from "./features/posts/repositories/posts.repository";
import { PostController } from "./features/posts/posts.controller";
import { PostQueryRepository } from "./features/posts/repositories/posts.query-repository";
import { ApiLogsService } from "./features/apiLogs/apiLogs.service";
import { ApiLogsRepository } from "./features/apiLogs/apiLogs.repository";
import { CommentsRepository } from "./features/comments/repositories/comments.repository";
import { CommentsQueryRepository } from "./features/comments/repositories/comments.query-repository";
import { CommentsService } from "./features/comments/comments.service";
import { CommentsController } from "./features/comments/comments.controller";
import { MessagesQueryRepository } from "./features/messages/repositories/messages.query-repository";
import { MessagesController } from "./features/messages/messages.controller";
import { WebSocketService } from "./adapters/webocket.service";
import { MessagesRepository } from "./features/messages/repositories/messages.repository";
import { LikesRepository } from "./features/likes/likes.repository";
import { LikesController } from "./features/likes/likes.controller";
import { LikesService } from "./features/likes/likes.service";
import { StorageService } from "./adapters/storage.service";

export const container = new Container();

container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);

container.bind(NodemailerService).to(NodemailerService);
container.bind(BcryptService).to(BcryptService);
container.bind(JwtService).to(JwtService);

container.bind(SecurityDeviceRepository).to(SecurityDeviceRepository);
container.bind(SecurityDeviceQueryRepository).to(SecurityDeviceQueryRepository);
container.bind(SecurityDeviceService).to(SecurityDeviceService);
container.bind(SecurityDeviceController).to(SecurityDeviceController);

container.bind(UserRepository).to(UserRepository);
container.bind(UserQueryRepository).to(UserQueryRepository);
container.bind(UserService).to(UserService);
container.bind(UserController).to(UserController);

container.bind(PostRepository).to(PostRepository);
container.bind(PostQueryRepository).to(PostQueryRepository);
container.bind(PostService).to(PostService);
container.bind(PostController).to(PostController);

container.bind(ApiLogsService).to(ApiLogsService);
container.bind(ApiLogsRepository).to(ApiLogsRepository);

container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentsService).to(CommentsService);
container.bind(CommentsController).to(CommentsController);

container.bind(MessagesQueryRepository).to(MessagesQueryRepository);
container.bind(MessagesController).to(MessagesController);
container.bind(MessagesRepository).to(MessagesRepository);

container.bind(LikesController).to(LikesController);
container.bind(LikesService).to(LikesService);
container.bind(LikesRepository).to(LikesRepository);    

container.bind(StorageService).to(StorageService);

container.bind(WebSocketService).to(WebSocketService);
    








