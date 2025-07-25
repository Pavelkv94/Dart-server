import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { ApiError } from "../../exeptions/api-error";
import { OutputDataWithPagination, SortDirection } from "../../types/common-types";
import { HTTP_STATUSES } from "../../types/enums";
import { UsersInputQueryModel, UserViewModel, UsersValidInputQueryModel, UserInputModel, URIParamsUserModel, ContactInputModel } from "./domain/users.models";
import { UserQueryRepository } from "./repositories/users.query-repository";
import { UserService } from "./users.service";
import { AuthService } from "../auth/auth.service";

@injectable()
export class UserController {
  constructor(public userService: UserService, public userQueryRepository: UserQueryRepository, public authService: AuthService) { }

  async getUsers(req: Request<{}, {}, {}, UsersInputQueryModel>, res: Response<OutputDataWithPagination<UserViewModel>>, next: NextFunction) {
    try {
      const queryData: UsersValidInputQueryModel = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm,
      };
      const users = await this.userQueryRepository.findAllUsers(queryData, req.user.id);

      res.status(HTTP_STATUSES.SUCCESS).json(users);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async getUser(req: Request<URIParamsUserModel>, res: Response<UserViewModel>, next: NextFunction) {
    try {
      const user = await this.userQueryRepository.findUserById(req.params.id);

      if (!user) {
        return next(ApiError.NotFound("The requested user was not found"));
      }

      res.status(HTTP_STATUSES.SUCCESS).json(user);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>, next: NextFunction) {
    try {
      const newUser = await this.userService.create(req.body);

      if (!newUser) {
        return next(ApiError.NotFound("The requested user was not found"));
      }

      await this.authService.setConfirmEmailStatus(newUser.id, true);

      res.status(201).json(newUser);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async updateUser(req: Request<{}, {}, any>, res: Response, next: NextFunction) {
    try {
      await this.userService.updateUser(req.user.id, req.body);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async uploadUserPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userQueryRepository.findUserById(req.user.id);
      if (!user) {
        return next(ApiError.NotFound("The requested user was not found"));
      }
      const file = req.file;
      if (file) {
        const filename = await this.userService.uploadUserPhoto(user, file);
        res.status(200).json({ filename });
      } else {
        return next(ApiError.BadRequest("Ошибка загрузки файла"));
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async uploadUserBackground(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userQueryRepository.findUserById(req.user.id);
      if (!user) {
        return next(ApiError.NotFound("The requested user was not found"));
      }
      const file = req.file;
      if (file) {
        const filename = await this.userService.uploadUserBackground(user, file);
        res.status(200).json({ filename });
      } else {
        return next(ApiError.BadRequest("Ошибка загрузки файла"));
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async deleteUser(req: Request<URIParamsUserModel>, res: Response, next: NextFunction) {
    try {
      await this.userService.deleteUser(req.params.id);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async setContactAction(req: Request<{}, {}, ContactInputModel>, res: Response, next: NextFunction) {
    try {
      await this.userService.setContactAction(req.user.id, req.body);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
