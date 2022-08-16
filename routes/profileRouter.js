const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");
const fileController = require("../controllers/fileController");
const fileupload = require("express-fileupload");
let bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(fileupload());


router.get("/user/:user_id", authMiddleware, profileController.getProfile);


// router.post('/upload', authMiddleware, fileController.createDir)
router.post('/upload', authMiddleware, fileController.uploadFile)

module.exports = router;
