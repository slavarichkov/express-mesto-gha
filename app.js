const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const process = require('process');
const bodyParser = require('body-parser');
const usersRouters = require('./routes/users.js'); // импортируем роутер пользователей
const cardsRouters = require('./routes/cards.js'); // импортируем роутер карточек

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use('/', usersRouters) // подключаем роутер юзеров
app.use('/', cardsRouters); // подключаем роутер карточек
app.use((req, res, next) => {
  req.user = {
    _id: '6389a6305892c3c9822d8829'
  };

  next();
});


// подключаемся к серверу mongo и затем к базе
mongoose.connect('mongodb://127.0.0.1/mestodb', (req, res) => {
  console.log('DB OK');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
  })
})
  .catch((err) => { console.log(err) });

// глобальный обработчик ошибок
process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

// Выбросим синхронную ошибку
throw new Error(`Ошибка, которую мы пропустили`);
