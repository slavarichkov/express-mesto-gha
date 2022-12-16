const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

const {
  getUser, getAllUsers, updateAvatar, updateUser,
} = require('../controllers/users'); // импортируем контроллеры пользователей

router.get('/users', getAllUsers);

router.get('/users/:id', getUser);

router.patch('/users/me', celebrate({ // обновляет профиль
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({ // обновляет аватар
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    avatar: Joi.string().required().min(2),
  }),
}), updateAvatar);

module.exports = router; // экспортировали роутер
