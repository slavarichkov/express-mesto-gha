const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const bodyParser = require('body-parser');

const usersRouters = require('./routes/users'); // импортируем роутер пользователей
const cardsRouters = require('./routes/cards'); // импортируем роутер карточек
const { BAD_REQUEST } = require('./utils/constant');// импортируем коды ошибок

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6389a6305892c3c9822d8829',
  };

  next();
});
app.use(bodyParser.json());
app.use('/', usersRouters); // подключаем роутер юзеров
app.use('/', cardsRouters); // подключаем роутер карточек
app.use('*', (req, res) => res.status(BAD_REQUEST).send({ message: 'Произошла ошибка' }));

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
  console.log(`${origin} ${err} c текстом ${err.message} не была обработана. Обратите внимание!`);
});
