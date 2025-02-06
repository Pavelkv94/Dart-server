import { UserNode } from "../domain/users.models";

export class UserViewDto {
  email: string;
  id: string;
  login: string;
  createdAt: string;
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
  friends: string[];
  facebook: string;
  youtube: string;
  vk: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  telegram: string;

  constructor(model: UserNode) {
    this.id = model.id;
    this.login = model.login;
    this.email = model.email;
    this.createdAt = model.createdAt;
    this.first_name = model.first_name;
    this.last_name = model.last_name;
    this.status = model.status;
    this.photo = model.photo;
    this.background = model.background;
    this.country = model.country;
    this.birthday = model.birthday;
    this.about = model.about;
    this.education = model.education;
    this.work = model.work;
    this.gender = model.gender;
    this.friends = model.friends;
    this.facebook = model.facebook;
    this.youtube = model.youtube;
    this.vk = model.vk;
    this.instagram = model.instagram;
    this.linkedin = model.linkedin;
    this.twitter = model.twitter;
    this.telegram = model.telegram;
  }

  static mapToView(user: UserNode): UserViewDto {
    return new UserViewDto(user);
  }

  static mapToViewArray(users: UserNode[]): UserViewDto[] {
    return users.map((user) => this.mapToView(user));
  }
}
