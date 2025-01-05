import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 3 символов').isLength({ min: 3 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 3 символов').isLength({ min: 3 }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }),
];

