const user = require('../models/user');// импортируем модель(схему) юзера
const { // импортируем коды ошибок
  OK, BAD_REQUEST, INTERNAL_SERVER_ERROR,
} = require('../utils/constant');

const getAllUsers = (req, res) => {
  user.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  user.findById(req.params._id)
    .then((userData) => {
      if ((userData) === null) {
        res.status(BAD_REQUEST).send({ message: 'Пользователь не найден' });
      } else { res.status(OK).send(user); }
    }).catch((err) => {
      if (err.name === 'CastError') { res.status(BAD_REQUEST).send({ message: 'Передан некорретный id пользователя' }); }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;// получим из объекта запроса имя и описание пользователя
  user.create({ name, about, avatar }).then((newUser) => res.status(OK).send(newUser))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: 'Передан некорретный id пользователя' });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
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

  ).then((updateData) => res.status(OK).send({ data: updateData }))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
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

  ).then((updateData) => res.status(OK).send({ data: updateData }))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
    });
};

module.exports = {
  getUser, getAllUsers, createUser, updateAvatar, updateUser,
};
