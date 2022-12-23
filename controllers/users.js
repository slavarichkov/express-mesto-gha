const bcrypt = require('bcryptjs'); // импортируем bcrypt для хэширования пароля;
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken;
const escape = require('escape-html'); // модуль, подставляющий мнемоники

const user = require('../models/user'); // импортируем модель(схему) юзера
const { OK } = require('../utils/constant'); // импортируем коды ошибок

// Импорт классов ошибок
const BAD_REQUEST_M = require('../utils/mist/BAD_REQUEST');
const INTERNAL_SERVER_ERROR_M = require('../utils/mist/INTERNAL_SERVER_ERROR');
const NOT_FOUND_M = require('../utils/mist/NOT_FOUND');
const CONFLICT_M = require('../utils/mist/CONFLICT');
const UNAUTHORIZED_M = require('../utils/mist/UNAUTHORIZED');

const getAllUsers = (req, res) => { // получить всех пользователей
  user.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(() => new INTERNAL_SERVER_ERROR_M('Произошла ошибка'));
};

const getUser = (req, res) => { // получить пользователя
  user.findById(req.params.id) // получить пользователя по айди
    .then((userData) => {
      if ((userData) === null) {
        throw new NOT_FOUND_M('Пользователь не найден'); // переведем в catch через throw
      } else { res.status(OK).send(userData); }
    }).catch((err) => {
      if (err.name === 'CastError') {
        throw new BAD_REQUEST_M('Передан некорретный id пользователя');
      } else { throw new INTERNAL_SERVER_ERROR_M('Произошла ошибка'); }
    });
};

const createUser = (req, res, next) => { // создать пользователя
  const { // получим из объекта запроса имя и описание пользователя
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10) // хешируем пароль
    .then((hash) => {
      user.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }).then((newUser) => {
        res.status(OK).send(newUser);
        console.log(escape(name));
      })
        .catch((err) => {
          if (err.code === 11000) {
            next(new CONFLICT_M('Пользователь с таким Email уже существует'));
          }
          next(err);
        });
    });
};

const updateAvatar = (req, res) => { // обновить аватар
  const { avatar } = req.body; // получим из объекта запроса аватар
  user.findByIdAndUpdate(
    req.user._id,

    {
      avatar,
    },

    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },

  ).then((updateData) => res.status(OK).send({ data: updateData }))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        throw new BAD_REQUEST_M('Переданы некорректные данные');
      } else { throw new INTERNAL_SERVER_ERROR_M('Произошла ошибка'); }
    });
};

const updateUser = (req, res) => { // обновить информацию о пользователе
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя
  user.findByIdAndUpdate(
    req.user._id,

    {
      name,
      about,
    },

    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },

  ).then((updateData) => res.status(OK).send({ data: updateData }))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        throw new BAD_REQUEST_M('Переданы некорректные данные');
      } else { throw new INTERNAL_SERVER_ERROR_M('Произошла ошибка'); }
    });
};

const login = (req, res) => { // получает из запроса почту и пароль и проверяет их
  const { password, email } = req.body; // получим из объекта запроса
  user.findOne({ email }).select('+password') // проверить есть ли пользователь с такой почтой, select('+password') - добавляет пароль, заблокирован в схеме
    .then((dataUser) => {
      if (!dataUser) { // если не найден по почте
        throw new NOT_FOUND_M('Неправильная почта или пароль');
      }

      return bcrypt.compare(password, user.password); // проверить пароль, если пользователь найден
    })
    .then((matched) => {
      if (!matched) { // хеши (пароль) не совпали
        throw new NOT_FOUND_M('Неправильная почта или пароль');
      }
      // если совпали, то создадим токен
      const token = jwt.sign({ _id: user._id }, 'e70c5d15f42ff6749dd9a1140d7efc49', { expiresIn: '7d' });
      res.cookie('jwt', token, { // сохранить в куки браузера, Первый аргумент — это ключ, второй — значение.
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true, // браузер посылает куки, только если запрос сделан с того же домена
      })
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch(() => {
      throw new UNAUTHORIZED_M('Запрос не был применён');
    });
};

module.exports = {
  getUser, getAllUsers, createUser, updateAvatar, updateUser, login,
};
