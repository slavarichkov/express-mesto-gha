const card = require('../models/card');// импортируем модель(схему) карточки
const user = require('../models/user');// импортируем модель(схему) юзера для проверки при постановке и удалении лайков

const {
  OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND,
} = require('../utils/constant');// импортируем коды ошибок

const getAllCards = (req, res) => { // получить все карточки
  card.find({}) // поиск всех карточек в бд
    .then((cards) => res.status(OK).json(cards))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }));
};

const createCard = (req, res) => { // создать карточку
  const { name, link } = req.body; // получим из объекта запроса данные для карточки
  const owner = req.user._id; // получить захардкоденный айди юзера
  card.create({ name, link, owner }) // создать карточку в бд
    .then((newCard) => res.status(OK).send(newCard))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: `Произошла ошибка ${err.message}` });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` }); }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params.cardId; // получим из объекта запроса уникальный id карточки
  card.findByIdAndRemove(cardId) // удалить карточку
    .then(() => { res.status(OK).send({ message: 'Выполнено' }); })
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: `Произошла ошибка ${err.message}` });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err}` }); }
    });
};

const addLike = (req, res) => {
  user.findById(req.user._id).then((userId) => { // проверить есть ли юзер в базе
    if (userId === null) {
      res.status(BAD_REQUEST).send({ message: 'Произошла ошибка' });
    } else {
      card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true },
      );
    }
  })
    .then(() => {
      res.status(OK).send({ message: 'Выполнено' });
    })
    .catch((err) => {
      if (err.name === 'CastError') { res.status(NOT_FOUND).send({ message: `Произошла ошибка ${err.message}` }); }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const deleteLike = (req, res) => {
  user.findById(req.user._id).then((userId) => { // проверить есть ли юзер в базе
    if (userId === null) {
      res.status(BAD_REQUEST).send({ message: 'Произошла ошибка' });
    } else {
      card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true },
      );
    }
  })
    .then(() => { res.status(OK).send({ message: 'Выполнено' }); })
    .catch((err) => {
      if (err.name === 'CastError') { res.status(NOT_FOUND).send({ message: `Произошла ошибка ${err.message}` }); }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, addLike, deleteLike,
};
