import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../exeptions/api-error";
import { injectable } from "inversify";
import { MessagesQueryRepository } from "./repositories/messages.query-repository";

@injectable()
export class MessagesController {
  constructor(private readonly messagesQueryRepository: MessagesQueryRepository) {}

  async getAllMessages(req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) {
    try {
      const messages = await this.messagesQueryRepository.getAllMessages();
      res.status(200).json(messages);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
