import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { ApiError } from "../../exeptions/api-error";
import { OutputDataWithPagination, SortDirection } from "../../types/common-types";
import { HTTP_STATUSES } from "../../types/enums";
import { UsersInputQueryModel, UserViewModel, UsersValidInputQueryModel, UserInputModel, URIParamsUserModel } from "./domain/users.models";
import { UserQueryRepository } from "./repositories/users.query-repository";
import { UserService } from "./users.service";

@injectable()
export class UserController {
  constructor(public userService: UserService, public userQueryRepository: UserQueryRepository) // , public authService: AuthService
  {}

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
      const users = await this.userQueryRepository.findAllUsers(queryData);

      res.status(HTTP_STATUSES.SUCCESS).json(users);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>, next: NextFunction) {
    try {
      const newUser = await this.userService.create(req.body);
      // const newUser = await this.userQueryRepository.findUserById(userId);

      if (!newUser) {
        return next(ApiError.NotFound("The requested user was not found"));
      }

      // await this.authService.setConfirmEmailStatus(newUser.id, true);

      res.status(201).json(newUser);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async deleteUser(req: Request<URIParamsUserModel>, res: Response, next: NextFunction) {
    try {
      const isDeletedUser = await this.userService.deleteUser(req.params.id);

      if (!isDeletedUser) {
        return next(ApiError.NotFound("The requested user was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
