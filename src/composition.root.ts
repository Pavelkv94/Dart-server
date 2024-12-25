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
// import { SecurityDeviceQueryRepository } from "./features/securityDevices/repositories/securityDevices.query-repository";
import { SecurityDeviceRepository } from "./features/securityDevices/repositories/securityDevices.repository";
// import { SecurityDeviceController } from "./features/securityDevices/securityDevices.controller";
import { SecurityDeviceService } from "./features/securityDevices/securityDevices.service";
import { SecurityDeviceQueryRepository } from "./features/securityDevices/repositories/securityDevices.query-repository";
import { SecurityDeviceController } from "./features/securityDevices/securityDevices.controller";


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

// container.bind(BlogRepository).to(BlogRepository);
// container.bind(BlogQueryRepository).to(BlogQueryRepository);
// container.bind(BlogService).to(BlogService);
// container.bind(BlogController).to(BlogController);

// container.bind(PostRepository).to(PostRepository);
// container.bind(PostQueryRepository).to(PostQueryRepository);
// container.bind(PostService).to(PostService);
// container.bind(PostController).to(PostController);

// container.bind(CommentRepository).to(CommentRepository);
// container.bind(CommentQueryRepository).to(CommentQueryRepository);
// container.bind(CommentService).to(CommentService);
// container.bind(CommentController).to(CommentController);

// container.bind(LikeService).to(LikeService);
// container.bind(LikeRepository).to(LikeRepository);