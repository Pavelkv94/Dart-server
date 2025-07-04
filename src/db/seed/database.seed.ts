import { randomUUID } from "crypto";
import { UserRepository } from "../../features/users/repositories/users.repository";
import { UserService } from "../../features/users/users.service";
import { db } from "../database";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../database.labels";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { usersSeedData } from "./users.data";
import * as bcrypt from 'bcrypt';
import { loremSeedData } from "./lorem.data";

async function seed() {
    const uri = process.env.DB_URL || "bolt://localhost:7687"; // Укажите ваш URI
    const user = process.env.DB_USERNAME || "neo4j"; // Ваше имя пользователя
    const password = process.env.DB_USERPASS || "password"; // Ваш пароль

    await db.connect(uri, user, password);
    await db.dropDatabase();

    // const payloads = usersSeedData.map(async user => ({
    //     ...user,
    //     password: await bcrypt.hash(user.login, 10),
    //     createdAt: new Date().toISOString(),
    //     confirmationCode: randomUUID(),
    //     confirmationStatus: false,
    //     confirmationCodeExpirationDate: getExpirationDate(30),
    //     recoveryCode: "",
    //     recoveryCodeExpirationDate: "",
    //     name: DatabaseAvailableLabels.USER,
    //     id: randomUUID(),
    //     deletedAt: null,
    //     photo: `avatars/${user.login}.webp`,
    //     background: `backgrounds/${user.login}.webp`,
    //     contacts: [],
    //     friends: [],
    // }))

    // await db.createNode(DatabaseAvailableLabels.USER, payloads[1]);
    for (const userSeed of usersSeedData) {
        const user = await db.createNode(DatabaseAvailableLabels.USER, {
            ...userSeed,
            password: await bcrypt.hash(userSeed.login, 10),
            createdAt: new Date().toISOString(),
            confirmationCode: randomUUID(),
            confirmationStatus: false,
            confirmationCodeExpirationDate: getExpirationDate(30),
            recoveryCode: "",
            recoveryCodeExpirationDate: "",
            name: DatabaseAvailableLabels.USER,
            id: randomUUID(),
            deletedAt: null,
            photo: `avatars/${userSeed.login}.webp`,
            background: `backgrounds/${userSeed.login}.webp`,
            contacts: [],
            friends: [],
        });
        console.log(`User ${(await userSeed).login} created`);

        for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
            const newPost = {
                id: randomUUID(),
                image_url: "",
                user_id: user.id,
                text: loremSeedData[Math.floor(Math.random() * loremSeedData.length)],
                createdAt: new Date().toISOString(),
                deletedAt: null,
            }
            await db.createNode(DatabaseAvailableLabels.POST, newPost);

            await db.connectNodes({
                label1: DatabaseAvailableLabels.USER,
                label2: DatabaseAvailableLabels.POST,
                property1: "id",
                value1: user.id,
                property2: "id",
                value2: newPost.id,
                relation: DatabaseAvailableRelations.USER_POST,
            });
        }
    }
    await db.disconnect();
}

seed();