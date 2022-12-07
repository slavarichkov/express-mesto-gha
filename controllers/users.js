const user = require('../models/user');// импортируем модель(схему) юзера
const {
  OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND,
} = require('../utils/constant');// импортируем коды ошибок

const getAllUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` }));
};

const getUser = (req, res) => {
  user.findById(req.params._id)
    .then((userData) => {
      if ((userData) === null) {
        res.status(BAD_REQUEST).send({ message: 'Пользователь не найден' });
      } else { res.status(OK).send(user); }
    }).catch((err) => {
      if (err.name === 'CastError') { res.status(BAD_REQUEST).send({ message: `Произошла ошибка ${err.message}` }) }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;// получим из объекта запроса имя и описание пользователя
  user.create({ name, about, avatar }).then((newUser) => res.status(OK).send(newUser))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: `Произошла ошибка ${err.message}` });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` }); }
    });
};

const updateAvatar = (req, res) => {
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

  ).then(() => res.status(OK).send('информация обновлена'))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: `Произошла ошибка ${err.message}` });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` }); }
    });
};

const updateUser = (req, res) => {
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

  ).then(() => res.status(OK).send('информация обновлена'))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: `Произошла ошибка ${err.message}` });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` }); }
    });
};

module.exports = {
  getUser, getAllUsers, createUser, updateAvatar, updateUser,
};
