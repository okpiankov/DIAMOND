//Так не надо делать!: Никакой передачи токена через хедерсы запросов. const token = await(req.headers.authorization || '').replace(/Bearer\s?/, '');
//Любой может украсть токен и 100% пройдет проверку!
//Токен должен передаваться на клиент только в куках с оцией HttpOnly и обратно приходить на сервер тоже в этих же куках
//Токен достаю из cookies через установленный cookieParser()
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";

//Middleware для проверки токена приходящего с клиента
export const checkAuth = (req, res, next) => {
  // const token = await(req.headers.authorization || '').replace(/Bearer\s?/, '');
  // console.log(token)

  const token = req.cookies.cookieName;
  // console.log("Cookies: ", req.cookies.cookieName);

  if (token) {
    try {
      //Расшифровываю токен по ключю и достаю из него _id пользователя
      // const decoded = jwt.verify(token, "secret123");
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      // console.log(decoded);

      //Нахожу пользователя по _id в БД
      const users = UserModel.findOne({
        _id: decoded._id,
      });
      // console.log(users);

      //Если пользователь есть в БД то далее через next() говорю выполни функцию контроллер в роуте
      if (users) {
        next();
      } else {
        return res.status(403).json({
          message: "Нет доступа",
        });
      }
    } catch (e) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }
};
