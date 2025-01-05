import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { UserModel } from "../models/User.js";
import { env } from "process";

//Регистрация
//Передаю пароль с клиента на сервер в открытом виде - это нормально
//Но далее на бэкенде пароль  обязательно зашифровываю через  библиотеку bcrypt
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    //Шифрую пароль приходящий с клиента очень хороший способ чере bcrypt
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    //Передаю сам пароль и соль(алгорит шифрования)
    const passwordHash = await bcrypt.hash(password, salt);

    //Подготавливаю документ на создание пользователя на основании схемы-модели
    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      // passwordHash: req.body.passwordHash,
      passwordHash,
      role: req.body.role,
      phone: req.body.phone,
    });

    //Создаю(сохраняю) пользователя в базе даных mongoDB:
    const user = await doc.save();

    //Создаю токен для пользователя со сроком действия 30 дней _id- это формат mongoDB
    const token = jwt.sign(
      {
        _id: user._id,
      },
      // "secret123",
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );

    const options = {
      maxAge: 1000 * 60 * 60, // срок жизни cookie 60 минут
      httpOnly: true, // такие куки доступны только для установки сервером недоступны на клиенте в document.cookie
      // signed: true
    };
    //Устанавливаю куки и записываю туда токен(в токене содержится _id пользователя)
    res.cookie("cookieName", token, options);

    user.passwordHash = undefined;
    //Возвращаю информацию о пользователе
    //Очень важно  роут не должен вернуть 2 ответа или успешный результат или ошибку!
    //user._doc, тк user содержит много не нужно информации делаю его чище
    res.json({
      ...user._doc,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

//Авторизация
export const login = async (req, res) => {

  try {
    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+passwordHash"
    );
    // user._doc.passwordHash = undefined;

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    //Сравниваю пароль в запросе с паролем в БД
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      // "secret123",
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );

    const options = {
      maxAge: 1000 * 60 * 60, // срок жизни 60 минут
      httpOnly: true, // такие куки доступны только для установки сервером недоступны на клиенте в document.cookie
      // signed: true
    };
    //Устанавливаю куки и записываю туда токен(в токене содержится _id пользователя)
    res.cookie("cookieName", token, options);

    user.passwordHash = undefined;
    res.json({
      ...user._doc,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

//Создаю пользователя
export const createUser = async (req, res) => {
  // console.log(req.body)
  try {
    const doc = new UserModel(req.body);

    const user = await doc.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать товар",
    });
  }
};

//Получаю всех users, метод find
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пользователей",
    });
  }
};

//Получаю 1 пользователя по _id, метод findOne
export const getUserId = async (req, res) => {
  console.log(req);
  try {
    const users = await UserModel.findOne({
      _id: req.params.id,
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};

//Обновляю данные пользователя
export const updateUser = async (req, res) => {
  console.log(req.body);

  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: req.body._id },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить данные пользователя",
    });
  }
};

//Удаляю пользователя
export const deleteUser = async (req, res) => {
  console.log(req.params);

  try {
    const product = await UserModel.findOneAndDelete({ _id: req.params.id });
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить пользователя",
    });
  }
};
//Связанный запрос через populate
//Получаю 1 пользователя по _id и все его заказы
export const getUserOrders = async (req, res) => {
  console.log(req);
  try {
    const users = await UserModel.findOne({
      _id: req.params.id,
    }).populate("orders");

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};
