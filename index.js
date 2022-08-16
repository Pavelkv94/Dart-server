const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const ProfileRouter = require("./routes/profileRouter");

require("dotenv").config();

const PORT = process.env.PORT || 5000;
const url = `mongodb+srv://${process.env.DB_OWNER}:${process.env.DB_PASS}@clusterfortgbot.hi5sp.mongodb.net/Auth?retryWrites=true&w=majority`;

// Установим подключение по умолчанию
mongoose
    .connect(url)
    .then(() => console.log("DB connected"))
    .catch((err) => {
        console.log(err);
    });

// Позволим Mongoose использовать глобальную библиотеку промисов
mongoose.Promise = global.Promise;

// Получение подключения по умолчанию
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

const server = express();

//todo server.use(cors({ origin: "http://localhost:3000" }))
server.use(cors({ origin: "*" })); //!------CORS DANGER ==> ./corsMiddleware.js

server.use('/storage', express.static('storage')) //публичная папка(статика)

server.use(express.json());
server.use("/profile",ProfileRouter);
server.use("/auth", authRouter);
server.use(
    express.static("public", {
        setHeaders: function setHeaders(res, path, stat) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type");
        },
    })
);


const start = async () => {
  try {
      await mongoose.connect(url);
      server.listen(PORT, () =>
          console.log(`Server is running at port ${PORT}`)
      );
  } catch (e) {
      console.log(e);
  }
};

start();
