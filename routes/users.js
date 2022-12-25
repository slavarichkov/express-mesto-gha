// СОЗДАНИЕ И АВТОРИЗАЦИЯ ПОЛЬЗОВАТЕЛЯ ВЫНЕСЕНЫ В АПП, ТАК КАК НЕ ЗАЩИЩЕНЫ АВТОРИЗАЦИЕЙ

const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

const {
  getUser, getAllUsers, updateAvatar, updateUser, getUserSelf,
} = require('../controllers/users'); // импортируем контроллеры пользователей

router.get('/users', getAllUsers); // получить всех пользователей

router.get('/users/:id', celebrate({ // получить пользователя
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUser);

router.get('/users/me', celebrate({ // получить информацию о текущем пользователе
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserSelf);

router.patch('/users/me', celebrate({ // обновляет профиль
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({ // обновляет аватар
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    avatar: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
  }),
}), updateAvatar);

module.exports = router; // экспортировали роутер
