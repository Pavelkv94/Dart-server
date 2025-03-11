
import { UserInputModel } from "../features/users/domain/users.models";

export type FieldNamesType = keyof UserInputModel//! | keyof BlogInputModel | keyof PostInputModel | keyof CommentInputModel | keyof UserInputModel;

type ErrorMessageType = {
  message: string;
  field: string;
};

export type OutputErrorsType = {
  message?: string;
  errorsMessages: ErrorMessageType[];
};
