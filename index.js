const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const ProfileRouter = require("./routes/profileRouter");
const outDataRouter = require("./routes/outDataRouter");
const postsRouter = require("./routes/postsRouter");
const usersRouter = require("./routes/usersRouter");
const messagesRouter = require("./routes/messagesRouter");
const Message = require("./models/Message");
const http = require('http')

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
const httpServer = http.createServer(server)
//todo server.use(cors({ origin: "http://localhost:3000" }))
server.use(cors({ origin: "*" })); //!------CORS DANGER ==> ./corsMiddleware.js

server.use('/storage', express.static('storage')) //публичная папка(статика)

server.use(express.json());
server.use("/profile",ProfileRouter);
server.use("/auth", authRouter);
server.use("/weather", outDataRouter);
server.use("/posts", postsRouter);
server.use("/users", usersRouter);
server.use("/messages", messagesRouter);
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
      httpServer.listen(PORT, () =>
          console.log(`Server is running at port ${PORT}`)
      );
  } catch (e) {
      console.log(e);
  }
};


//!+++++++++++++++++++++++++++++++++++++++++++++++++++++++
const WebSocket = require('ws')
const wss = new WebSocket.Server({
    'server': httpServer
})

wss.on('connection', function connection(ws) {
    ws.on('message', async  function (message) {
        message = JSON.parse(message)
        const newMessage = new Message({
            user_id: message.user_id,
            photo: message.photo,
            message: message.message,
            id: message.id,
            event: message.event,
            date: message.date,
            image: message.image
        })
        await newMessage.save();
        
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            // case 'connection':
            //     broadcastMessages(messages)
            //     break;
        }
    })
})

function broadcastMessage(message, id) {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))
    })
}
function broadcastMessages(messages, id) {
    // const messages = Message.find({});
    wss.clients.forEach(client => {
        client.send(messages)
    })
}
//!+++++++++++++++++++++++++++++++++++++++++++++++++++++++

start();
