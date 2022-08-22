const UserAuth = require("../models/UserAuth");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs"); //хэширование пароля
const { validationResult } = require("express-validator"); //для получения сообщений об ошибках
const jwt = require("jsonwebtoken"); //для работы с jwt
const { secret } = require("../config"); // получаем секретный ключ
const { v1 } = require("uuid");
const UserProfile = require("../models/UserProfile");

//создаем функцию которая принимает ИД и роль и засовываем эт овсе в обьект пайлоад
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "24h" }); //передаем обьект, секретный ключ который храниться на сервере и опции
};

class authController {
    async registration(req, res) {
        try {
            //валидация
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.errors[0].msg, errors });
            }

            const { email, password } = req.body;
            const candidate = await UserAuth.findOne({ email }); //ищем пользователя с этим email
            if (candidate) {
                return res.status(400).json({ message: "Пользователь уже существует" });
            }

            var hashPassword = bcrypt.hashSync(password, 7); //Хэшируем пароль

            const userRole = await Role.findOne({ value: "User" }); //присваиваем роль Юзера
            const uniqueId = v1();
            const user = new UserAuth({
                user_id: uniqueId,
                password: hashPassword,
                email,
                roles: [userRole.value],
            }); //создаем пользователя

            const userProfile = new UserProfile({
                user_id: uniqueId,
                email,
                first_name: "John",
                last_name: "Doe",
                status: "This is status!",
                photo: "",
                background: "https://wallpaper.dog/large/17198193.jpg",
                country: "Belarus, Minsk",
                birthday: "02/17/1994",
                contacts: {
                    facebook: "https://facebook.com",
                    youtube: "https://youtube.com",
                    vk: "https://vk.com",
                    instagram: "https://instagram.com",
                    linkedin: "https://www.linkedin.com/",
                    twitter: "https://www.twitter.com/",
                    telegram: "https://t.me/",
                },
                about: "Tell about youself",
                created_at: new Date(),
                friends: []
            });

            await user.save(); //сохраняем в БД
            await userProfile.save(); //сохраняем в БД

            return res.json({ message: "Пользователь зарегестрирован" }); //мессадж
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Registration Error" });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body; //получаем данные

            const user = await UserAuth.findOne({ email }); // ищем юзера
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const validPassword = bcrypt.compareSync(password, user.password); //валидация введенного пароля
            if (!validPassword) {
                return res.status(400).json({ message: "Password incorrect" });
            }

            const token = generateAccessToken(user._id, user.roles); // _id монго генерирует сам
            return res.json({ token, email: user.email, roles: user.roles, user_id: user.user_id });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Login Error" });
        }
    }

    async me(req, res) {
        try {
            const { user_id } = req.params;

            const userData = await UserAuth.findOne({ user_id });
            return res.status(200).json({ email: userData.email, roles: userData.roles, user_id: userData.user_id, _id: userData._id });
        } catch (e) {
            return res.status(403).json({ message: "You are not autorized" });
        }
    }

    async getUsers(req, res) {
        try {
            //todo создаем роли(один раз)
            // const userRole = new Role();
            // const adminRole = new Role({value: "ADMIN"})
            // await userRole.save();
            // await adminRole.save()

            const users = await UserAuth.find(); //получаем юзеров
            res.json(users);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();
