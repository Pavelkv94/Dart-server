const Router = require("express");
const router = new Router();
const controller = require("../controllers/authController");
const { check } = require("express-validator"); //валидатор
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
    "/registration",
    [check("email", "Email format is incorrect").notEmpty().isEmail(), check("password", " Password must be more than 4 and less than 10 symbols").isLength({ min: 4, max: 10 })],
    controller.registration
);
router.post("/login", controller.login);
router.get("/me/:user_id", authMiddleware, controller.me);
router.get("/getPhoto/:user_id", authMiddleware, controller.getPhoto);
// router.get("/users", authMiddleware,  controller.getUsers); //todo добавляем мидлварю чтоб только зареганый юзер мог сделать такой запрос
router.get("/users", roleMiddleware(["ADMIN", "User"]), controller.getUsers); //todo добавляем мидлварю чтоб только юзер с указанной ролью мог сделать такой запрос

module.exports = router;
