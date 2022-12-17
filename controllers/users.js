const validator = require('validator');
const bcrypt = require('bcryptjs'); // импортируем bcrypt для хэширования пароля;
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken;
const escape = require('escape-html'); // модуль, подставляющий мнемоники

const user = require('../models/user');// импортируем модель(схему) юзера
const { // импортируем коды ошибок
  OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, CONFLICT,
} = require('../utils/constant');

const getAllUsers = (req, res) => { // получить всех пользователей
  user.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => { // получить пользователя
  user.findById(req.params.id)
    .then((userData) => {
      if ((userData) === null) {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      } else { res.status(OK).send(userData); }
    }).catch((err) => {
      if (err.name === 'CastError') { res.status(BAD_REQUEST).send({ message: 'Передан некорретный id пользователя' }); }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => { // создать пользователя
  const { // получим из объекта запроса имя и описание пользователя
    name, about, avatar, email, password,
  } = req.body;
  if (!validator.isEmail(email)) {
    res.status(BAD_REQUEST).send({ message: 'Проверьте правильность введенного email' });
  }
  // хешируем пароль
  bcrypt.hash(password, 10)
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
      }).catch((err) => {
        if (err.code === 11000) { res.status(CONFLICT).send({ message: 'Пользователь с таким Email уже существует' }); }
        res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.name}` });
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
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
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
    });
};

const login = (req, res) => { // получает из запроса почту и пароль и проверяет их
  const { password, email } = req.body; // получим из объекта запроса
  user.findOne({ email }).select('+password') // проверить есть ли пользователь с такой почтой, select('+password') - добавляет пароль, заблокирован в схеме
    .then((dataUser) => {
      if (!dataUser) {
        res.status(NOT_FOUND).send({ message: 'Неправильная почта или пароль' });
      }

      return bcrypt.compare(password, user.password); // проверить пароль, если пользователь найден
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали
        res.status(NOT_FOUND).send({ message: 'Неправильная почта или пароль' });
      }
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'e70c5d15f42ff6749dd9a1140d7efc49', { expiresIn: '7d' });
      res.cookie('jwt', token, { // сохранить в куки браузера, Первый аргумент — это ключ, второй — значение.
        // token - наш JWT токен, который мы отправляем
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true, // браузер посылает куки, только если запрос сделан с того же домена
      })
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getUser, getAllUsers, createUser, updateAvatar, updateUser, login,
};
