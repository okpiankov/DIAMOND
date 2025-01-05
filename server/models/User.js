import mongoose from "mongoose";

//Создал модель пользователя
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // Уникальность email
      unique: true,
    },
    // Пароль должен быть всегда зашифрован на случай доступа к БД стороннего лица
    //select: false, чтобы даже хешь не попадал на клиент
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    // passwordHash: String,
    //Если без объекта то поле не обязательное
    role: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    //Массив для хранения _id заказов
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      
    }],
    // orders: [],
  },
  //Дата создания и обновления всего объекта
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);

// Далее делаю Model-View-Controller(MVC)
