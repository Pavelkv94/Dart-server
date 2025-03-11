import { DatabaseAvailableLabels } from "../../../db/database.labels";
import { SortDirection } from "../../../types/common-types";

export type EmailConfirmationEntityType = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};
export type RecoveryPasswordEntityType = {
  recoveryCode: string | null;
  expirationDate: string | null;
};
export type UserEntityModel = {
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationEntityType;
  recoveryConfirmation: RecoveryPasswordEntityType;
};

export type UserPasswordModel = {
  password: string;
  id: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type UserUpdateInputModel = {
  email: string;
  login: string;
  createdAt: string;
  first_name: string;
  last_name: string;
  status: string;
  photo: string;
  background: string;
  country: string;
  birthday: string;
  contacts: Array<string>[];
  about: string;
  education: string;
  work: string;
  gender?: string;
  friends: Array<string>;
};

export type URIParamsUserModel = {
  id: string;
};

export type UsersInputQueryModel = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

export type UsersValidInputQueryModel = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

export type UserNode = {
  id: string;
  createdAt: string;
  confirmationCode: string;
  password: string;
  login: string;
  email: string;
  confirmationStatus: boolean;
  confirmationCodeExpirationDate: string;
  recoveryCode: string;
  recoveryCodeExpirationDate: string;
  name: DatabaseAvailableLabels;
  first_name: string;
  last_name: string;
  status: string;
  photo: string;
  background: string;
  country: string;
  birthday: string;
  about: string;
  education: string;
  work: string;
  gender: string;
  facebook: string;
  youtube: string;
  vk: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  telegram: string;
  friends: string[];
};

export enum ContactActionType {
  FOLLOW = "follow",
  UNFOLLOW = "unfollow",
}

export type ContactInputModel = {
  action: ContactActionType;
  targetUserId: string;
};
