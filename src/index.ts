import { db } from "./db/database";
import { initApp } from "./initApp";

const app = initApp();

const uri = process.env.DB_URL || "bolt://localhost:7687"; // Укажите ваш URI
const user = process.env.DB_USERNAME || "neo4j"; // Ваше имя пользователя
const password = process.env.DB_USERPASS || "password"; // Ваш пароль

db.connect(uri, user, password);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("...server started in port " + PORT);
});
