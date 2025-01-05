import { OrderModel } from "../models/Order.js";
import { UserModel } from "../models/User.js";

//Создаю заказ
export const createOrder = async (req, res) => {
  // console.log(req.body)
  try {
    const doc = new OrderModel(req.body);

    const order = await doc.save();

    //Через обновление документа записываю _id заказа в массив orders в сущность User
    //Функция updateOne, чтобы дописывать новые _id в []:
    //1 аргумент filter c с поиском юзера, 2 аргумент все оборачивать в объект {$push:
    //и массив не нужено указывать...
    const newOrder = await UserModel.updateOne(
      { _id: order.user },
      { $push: { orders: order._id } }
    );

    res.json(newOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать заказ",
    });
  }
};

//Получаю все заказы всех пользователей
export const getOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate("user");
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказы",
    });
  }
};

//Получаю все заказы авторизованного пользователя
export const getOrdersUser = async (req, res) => {
  // console.log(req.query.id) // req.query.id- достаю из url _id авторизованного юзера
  try {
    const order = await OrderModel.find({ user: req.query.id });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказы",
    });
  }
};

//Получаю 1 заказ по _id, метод findOne
//_id: c_   а в req.params.id id без _
export const getOrder = async (req, res) => {
  console.log(req.params.id);
  try {
    const order = await OrderModel.findOne({
      _id: req.params.id,
    });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказ",
    });
  }
};

//Обновляю заказ
export const updateOrder = async (req, res) => {
  // console.log(req.query.id) // req.query.id- достаю из url _id авторизованного юзера
  //не забывай указать total_price: req.body.total_price чтобы цена обновилась тоже после удаления товара
  console.log(req.body);
  try {
    const order = await OrderModel.findOneAndUpdate(
      { _id: req.body._id },
      { goods: req.body.goods, total_price: req.body.total_price },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказы",
    });
  }
};

//Удаляю заказ
export const deleteOrder = async (req, res) => {
  console.log(req.params);

  try {
    const order = await OrderModel.findOneAndDelete({ _id: req.params.id });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить заказ",
    });
  }
};

//Создаю заказ в админке
export const сreateOrderАdmin = async (req, res) => {
  console.log(req.body)
  try {
    const doc = new OrderModel(req.body);

    const order = await doc.save();

    //Через обновление документа записываю _id заказа в массив orders в сущность User
    //Функция updateOne, чтобы дописывать новые _id в []:
    //1 аргумент filter c с поиском юзера, 2 аргумент все оборачивать в объект {$push:
    //и массив не нужено указывать...
    const newOrder = await UserModel.updateOne(
      { _id: order.user },
      { $push: { orders: order._id } }
    );

    res.json(newOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать заказ",
    });
  }
};



//Ошибка не нужен массив обертка и обращение name: req.body.name, итд
//не существет! Обращаейся  так const doc = new OrderModel(req.body)
// {
//     goods: [
//   {
//     name: req.body.name,
//     price: req.body.price,
//     quantity: req.body.quantity,
//   },
//   ],
//     total_price: req.body.total_price,
//     user: req.body.user,
// }
