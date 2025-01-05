import { ProductModel } from "../models/Product.js";

//Получаю все продукты, метод find
export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить продукты",
    });
  }
};

//Получаю 1 продукт по _id, метод findOne
export const getProductId = async (req, res) => {
  // console.log(req.params.id)
  try {
    const products = await ProductModel.findOne({
      _id: req.params.id,
    });
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить продукт",
    });
  }
};

//Получаю все продукты по type('rings', 'earrings', 'bracelets', 'chains'), метод find
export const getProductsType = async (req, res) => {
  try {
    const products = await ProductModel.find({ type: req.params.type });
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить продукты",
    });
  }
};

//Поиск  по name, метод find
export const searchProducts = async (req, res) => {
  console.log(req.params.name);
  try {
    const products = await ProductModel.find({
      $text: { $search: req.params.name },
    });
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить продукты",
    });
  }
};

//Создаю продукт
export const createProduct = async (req, res) => {
  // console.log(req.body)
  try {
    const doc = new ProductModel(req.body);

    const order = await doc.save();

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать товар",
    });
  }
};

//Обновляю продукт
export const updateProduct = async (req, res) => {
  console.log(req.body)

  try {
    const product = await ProductModel.findOneAndUpdate(
      { _id: req.body._id },
      req.body, {new: true}
    );
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить товар",
    });
  }
};

//Удаляю продукт
export const deleteProduct = async (req, res) => {
  console.log(req.params)

  try {
    const product = await ProductModel.findOneAndDelete(
      { _id: req.params.id }
    );
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить товар",
    });
  }
};

//Обновляю картинки в продукте
export const updateImage = async (req, res) => {
  // console.log(req.body);
  try {
    const product = await ProductModel.findOneAndUpdate(
      { _id: req.body._id },
      { image: req.body.image },
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить список картинок",
    });
  }
};

//На клиенте ошибка 400(404) значит запрос с клиента не доходит до функции-контролер на сервере,
//и соответственно console.log(req.body) в функции-контролер не срабатывает
//возможно ошибка в пути (роуте) на сервере или не правильно передаю данные в запросе на клиенте...
//если ошибка 500 значит на сервере какая то ошибка напрмер в функции-контролер не правильно применил
//методы  mongoose