const express = require('express');
const mongoose = require('mongoose'); // БД
const process = require('process');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

const usersRouters = require('./routes/users'); // импортируем роутер пользователей
const cardsRouters = require('./routes/cards'); // импортируем роутер карточек
const auth = require('./middlewares/auth'); // импортируем авторизацию пользователя
const { NOT_FOUND } = require('./utils/constant');// импортируем коды ошибок
const { createUser, login } = require('./controllers/users'); // импортируем контроллеры пользователей

const { PORT = 3000 } = process.env;

const app = express();

// мидлверы

app.use(cookieParser());
app.use(bodyParser.json());

// роуты, не требуещие авторризации

app.post('/users', celebrate({ // создать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2),
    avatar: Joi.string().min(2),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), createUser);

app.post('/signin', celebrate({ // авторизовать пользователя
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);

app.use(auth); // защитить роуты ниже авторизацией
// При успешной авторизации в объекте запроса появится свойство user, достаь из него req.user._id
// в которое запишется пейлоуд токена

app.use('/', usersRouters); // подключаем роутер юзеров
app.use('/', cardsRouters); // подключаем роутер карточек
app.use('*', (req, res) => res.status(NOT_FOUND).send({ message: 'Cтраница не найдена' }));

// подключаемся к mongo и затем к серверу
mongoose.connect('mongodb://127.0.0.1/mestodb', () => {
  console.log('DB OK');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
})
  .catch((err) => console.log(err));

// глобальный обработчик ошибок
process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ошибка ${err} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
