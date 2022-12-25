const express = require('express');
const mongoose = require('mongoose'); // БД
const process = require('process');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных
const { requestLogger, errorLogger } = require('./middlewares/logger'); // логгеры

const usersRouters = require('./routes/users'); // импортируем роутер пользователей
const cardsRouters = require('./routes/cards'); // импортируем роутер карточек
const auth = require('./middlewares/auth'); // импортируем авторизацию пользователя
const { INTERNAL_SERVER_ERROR } = require('./utils/constant');// импортируем коды ошибок
const { createUser, login } = require('./controllers/users'); // импортируем контроллеры пользователей
const NOT_FOUND_M = require('./utils/mist/NOT_FOUND');

const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к mongo и затем к серверу
mongoose.connect('mongodb://127.0.0.1/mestodb', () => {
  console.log('DB OK');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
})
  .catch((err) => console.log(err));

// мидлверы

app.use(cookieParser()); // для работы с куки, хранить токен
app.use(bodyParser.json());
app.use(requestLogger); // подключаем логгер запросов

// роуты, не требуещие авторизации

app.post('/signup', celebrate({ // создать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({ // авторизовать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('*', (req, res, next) => next(new NOT_FOUND_M('Cтраница не найдена'))); // несуществующая страница

app.use(auth); // защитить роуты ниже авторизацией
// При успешной авторизации в объекте запроса появится свойство user, достаь из него req.user._id
// в которое запишется пейлоуд токена

app.use('/', usersRouters); // подключаем роутер юзеров
app.use('/', cardsRouters); // подключаем роутер карточек

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем INTERNAL_SERVER_ERROR по умолчанию
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
});

// глобальный обработчик ошибок
process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ошибка ${err} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
