import { container } from "../../src/composition.root";
import { db } from "../../src/db/database";
import { authManager } from "../helpers/auth.manager";
import { mockCreateUserDto } from "../helpers/datasets";
import { usersManager } from "../helpers/users.manager";
import { NodemailerService } from "../../src/adapters/mail.service";
import { UserQueryRepository } from "../../src/features/users/repositories/users.query-repository";

const nodemailerService = container.resolve(NodemailerService);
const userQueryRepository = container.resolve(UserQueryRepository);

describe("/auth", () => {
  beforeAll(async () => {
    const uri = process.env.DB_URL || "bolt://localhost:7687"; // Укажите ваш URI
    const user = process.env.DB_USERNAME || "neo4j"; // Ваше имя пользователя
    const password = process.env.DB_USERPASS || "password"; // Ваш пароль

    db.connect(uri, user, password);
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  afterEach(async () => {
    await db.dropDatabase();
  });

  it("should login user", async () => {
    await usersManager.createUser(mockCreateUserDto);

    const loginResponse = await authManager.loginUser({
      loginOrEmail: mockCreateUserDto.login,
      password: mockCreateUserDto.password,
    });
    expect(loginResponse.body.accessToken).toBeDefined();
  });

  it("should register user", async () => {
    await authManager.registerUser(mockCreateUserDto);
    const loginResponse = await authManager.loginUser({
      loginOrEmail: mockCreateUserDto.login,
      password: mockCreateUserDto.password,
    });
    const users = await usersManager.getUsers("", loginResponse.body.accessToken);
    expect(users.body.items.length).toBe(1);
  });

  it("should register user and check confirmation code", async () => {
    const fakeSendMail = () => Promise.resolve(true);
    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    await authManager.registerUser(mockCreateUserDto);

    const user = await userQueryRepository.findUserByEmail(mockCreateUserDto.email);

    const confirmResponse = await authManager.confirmation({ code: user!.confirmationCode });

    expect(confirmResponse.status).toBe(204);

    const updatedUser = await userQueryRepository.findUserByEmail(mockCreateUserDto.email);
    expect(updatedUser.confirmationStatus).toBe(true);
  });

  it("should resend email with new confirmation code", async () => {
    const fakeSendMail = () => Promise.resolve(true);
    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    const registrationResponse = await authManager.registerUser(mockCreateUserDto);
    expect(registrationResponse.status).toBe(204);

    const user = await userQueryRepository.findUserByEmail(mockCreateUserDto.email);

    await authManager.resendEmail({ email: mockCreateUserDto.email });

    const updatedUser = await userQueryRepository.findUserByEmail(mockCreateUserDto.email);
    expect(updatedUser.confirmationCode).not.toBe(user!.confirmationCode);
  });

  it("should logout user", async () => {
    await authManager.registerUser(mockCreateUserDto);

    const loginResponse = await authManager.loginUser({
      loginOrEmail: mockCreateUserDto.login,
      password: mockCreateUserDto.password,
    });
    const cookies = loginResponse.headers["set-cookie"];
    expect(cookies).toBeDefined();

    const refreshToken = cookies[0].split(" ")[0].split("=")[1];

    await authManager.logout(refreshToken);
  });

  it("password recovery", async () => {
    await authManager.registerUser(mockCreateUserDto);

    const fakeSendMail = () => Promise.resolve(true);
    nodemailerService.sendLetter = jest.fn().mockImplementation(fakeSendMail);

    await authManager.passwordRecovery({ email: mockCreateUserDto.email });

    const user = await userQueryRepository.findUserByEmail(mockCreateUserDto.email);

    await authManager.setNewPassword({
      recoveryCode: user!.recoveryCode,
      newPassword: mockCreateUserDto.password + "1",
    });

    await authManager.loginUser({
      loginOrEmail: mockCreateUserDto.login,
      password: mockCreateUserDto.password + "1",
    });
  });
});
