import { db } from "../../src/db/database";
import { authManager } from "../helpers/auth.manager";
import { mockCreateUserDto } from "../helpers/datasets";
import { usersManager } from "../helpers/users.manager";

describe("/users", () => {
  let accessToken: string;
  beforeAll(async () => {
    const uri = process.env.DB_URL || "bolt://localhost:7687"; // Укажите ваш URI
    const user = process.env.DB_USERNAME || "neo4j"; // Ваше имя пользователя
    const password = process.env.DB_USERPASS || "password"; // Ваш пароль

    db.connect(uri, user, password);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await usersManager.createUser(mockCreateUserDto);
    const loginResponse = await authManager.loginUser({
      loginOrEmail: mockCreateUserDto.login,
      password: mockCreateUserDto.password,
    });
    accessToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await db.disconnect();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  it("should return one user", async () => {
    const getUsersResponse = await usersManager.getUsers("", accessToken);
    expect(getUsersResponse.body.items.length).toBe(1);
  });

  it("should delete user", async () => {
    const createUserResponse = await usersManager.createUser(mockCreateUserDto);
    await usersManager.deleteUser(createUserResponse.body.id);
  });
});
