import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/"); // Папка для хранения загруженных файлов
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}${file.originalname.slice(-4)}`); // Используем оригинальное имя файла
  },
});

export const savePhotoToStorageMiddleware = multer({ storage: storage });

