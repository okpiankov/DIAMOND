//Очень важно: роут не должен вернуть 2 ответа!
import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation } from "./utils/validations.js";
import {
  createUser,
  deleteUser,
  getUserId,
  getUserOrders,
  getUsers,
  login,
  register,
  updateUser,
} from "./controllers/UserController.js";
import {
  createProduct,
  deleteProduct,
  getProductId,
  getProducts,
  getProductsType,
  searchProducts,
  updateImage,
  updateProduct,
} from "./controllers/ProductController.js";
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
  getOrdersUser,
  updateOrder,
  сreateOrderАdmin,
} from "./controllers/OrderController.js";
import multer from "multer";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { ProductModel } from './models/Product.js'
import { checkAuth } from "./utils/checkAuth.js";
// require('dotenv').config();
import dotenv from "dotenv";

dotenv.config();


//Создаю сервер:
const app = express();
//Для чтения express формата json команда:
app.use(express.json());

//Настройки для cookie чтобы они в браузере сохранялись
//Можно так origin: "http://localhost:5173", указывать порт клиента
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

//Создаю и прослушиваю порт 3333 на котором работает сервер
app.listen(3333, (err) => {
  if (err) {
    returnconsole.log(err);
  }
  console.log("Server OK");
});

//Подключаюсь к БД логин и пароль(указал при создании базы)  database:admin
//Но самой БД еще пока нет, создаю ее пишу название "shop" между /? в ссылке net/shop?retryWrites
//mongoDB сам автоматически на основании названия  схемы-модели User создал базу данных shop с разделом Users
//В прогах делаю запрос в insomnia от клиента а в mongoDB Сompass обновляю раздел БД и смотрю что записалось в БД
mongoose
  .connect(
    "mongodb+srv://database:admin@cluster0.z61vf.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  // .connect(process.env.MONGODB_URL) //получаю ссылку на БД из .env
  .then(() => console.log("DB oK"))
  .catch((err) => console.log("DB error", err));

//Папка для хранения файлов "uploads"
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//Использую мидлвер из multer  upload.single('image') или .array('image', 5) и ожидаю файлы image
//если файл пришел то далее выполняю код и возвращаю клиенту по какому пути сохранен файл
app.use("/uploads", express.static("uploads"));
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `${process.env.BASE_URL}/uploads/${req.file.originalname}`,
  });
});

//Удаление файлов из папки uploads, multer не надо использовать
//Достаточно функции удаления fs.unlink  из nodejs по умолчанию
//path =  как файловая система твоего компьютера этот путь определяет
//Либо абсолютный путь либо относительный  и + какой-нибудь идентификатор на конце

app.delete("/upload/delete/:basename", checkAuth, (req, res) => {
  // console.log("req.body.basename", req.body.basename);
  console.log("req.params", req.params);

  // const path = `/Users/user/Desktop/DIAMOND_Vue/server/uploads/${req.params.basename}`;
  //Указываю относительный путь
  const path = `./uploads/${req.params.basename}`;
  const image = fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(image);
  });
});

//Роуты для статусов 'client' и 'admin'
//checkAuth - мидлвер для проверки токена в куках вешаю на важные роуты для защиты
app.post("/auth/register", registerValidation, register);
app.post("/auth/login", loginValidation, login);
app.get("/users", getUsers);
app.get("/users/:id", getUserId);
// app.post('/users/create', createUser)
//Связанный запрос через populate:
app.get("/users/:id", getUserOrders);
app.patch("/admin/users/update", checkAuth, updateUser);
app.delete("/admin/users/delete/:id", checkAuth, deleteUser);

app.get("/products", getProducts);
app.get("/products/:id", getProductId);
app.get("/products/type/:type", getProductsType);
app.get("/products/name/:name", searchProducts);
app.post("/admin/product/create", checkAuth, createProduct);
app.patch("/admin/products/update", checkAuth, updateProduct);
app.delete("/admin/products/delete/:id", checkAuth, deleteProduct);
app.patch("/admin/products/updateImage/:id", checkAuth, updateImage);

app.post("/orders/create", createOrder);
app.get("/orders/all", getOrders);
app.get("/orders", getOrdersUser);
app.get("/orders/:id", getOrder);
app.post("/admin/orders/create", checkAuth, сreateOrderАdmin);
app.patch("/admin/orders/update/:id", checkAuth, updateOrder);
app.delete("/admin/orders/delete/:id", checkAuth, deleteOrder);

// //Настраиваю CORS политику, указываю какому домену разрешаю доступ - localhost:5173, 5173 порт моей клиентской части приложения,
// //Важно в запросе на клиенте указывать протокол http а не https
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
//   res.setHeader('Access-Control-Allow-Credentials', true)
//   // Использование звёздочек в качестве маски может быть рискованным
//   next()
// })

// // Запись продуктов в БД первоночальная для теста
// const products = [
//   {
//     image: ['https://pmdn.sokolov.io/pics/4F/0E/8B7136B7DFC73FBF6DA2202FF7C9.jpg'],
//     type: 'rings',
//     name: 'Кольцо из золота с бриллиантами Артикул: 1012617',
//     description: 'Красное золото 585 пробы, коньячный бриллиант (56 шт, 0.174 карат), вес 3.44г.',
//     price: 115000,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/F9/AE/832E4A1B3646FEEF6D5E66908E04.jpg'],
//     type: 'rings',
//     name: 'Кольцо из золота с бриллиантами и рубинами Артикул: 4010683',
//     description: 'Красное золото 585 пробы, рубин (9 шт, 1.197 карат), вес 4.34г.',
//     price: 200700,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/47/4B/4F3D267A680ED311E9C9DC68E624.jpg'],
//     type: 'rings',
//     name: 'Кольцо из белого золота с бриллиантом Артикул: 901013246',
//     description: 'Белое золото 585 пробы, бриллиант (природный) (1 шт, 0.75 карат), вес 2.78г.',
//     price: 714990,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/FD/8E/E456BA5FEE509F7CF34975337508.jpg'],
//     type: 'earrings',
//     name: 'Серьги из золота с бриллиантами и изумрудами Артикул: 3020648',
//     description: 'Красное золото 585 пробы, изумруд натуральный (2 шт, 7.383 карат), вес 4.67г.',
//     price: 263000,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/08/DB/2266C76C8C6BE9632537DFC1C78D.jpg'],
//     type: 'earrings',
//     name: 'Серьги из белого золота с бриллиантами Артикул: 1020724',
//     description: 'Белое золото 585 пробы, Бриллиант (природный) (2 шт, 0.076 карат), вес 2.86г.',
//     price: 93400,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/45/9A/F1C4492F36F8C26F99B251878B7D.jpg'],
//     type: 'earrings',
//     name: 'Серьги из белого золота с сапфирами Артикул: 20212563',
//     description: 'Белое золото 585 пробы, сапфир (2 шт, 7.3 карат), вес 4.43г.',
//     price: 129000,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/60/BE/62F9BCFE164DE34A990BCEC15EBF.jpg'],
//     type: 'bracelets',
//     name: 'Браслет из золота с рубинами Артикул: 4050041',
//     description: 'Красное золото 585 пробы, рубин (31 шт, 17.36 карат), вес 10.52г.',
//     price: 255000,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/6F/49/9F9115239EF3AFF5BD9ABA2D09DB.jpg'],
//     type: 'bracelets',
//     name: 'Браслет из белого золота с бриллиантами Артикул: 10503063',
//     description: 'Белое золото 585 пробы, Бриллиант (природный) (60 шт, 0.238 карат), вес 6.31г.',
//     price: 192000,
//     quantity: 1,
//   },
//   {
//     image: ['https://pmdn.sokolov.io/pics/9B/81/88DD731F8DE95BE34D253C581B67.jpg'],
//     type: 'chains',
//     name: 'Цепь мужская из золота, плетение Бисмарк Артикул: 581070702',
//     description: 'Красное золото 585 пробы, без вставок, вес 19.82 г.',
//     price: 333000,
//     quantity: 1,
//   },
// ]

// // Записываю разово все продукты в БД метод insertMany
// async function addDataToMongodb() {
//   await ProductModel.insertMany(products)
//   // console.log('Data added to MongoDB')
// }
// addDataToMongodb()

// // //Тест  get-запрос req-запрос, res-ответ. Перейди на localhost:3333 где крутится сервер
// // app.get('/', (req, res) => {
// //   res.send('Hello World!')
// // })
