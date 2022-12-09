const card = require('../models/card');// импортируем модель(схему) карточки

const { // импортируем коды ошибок
  OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND,
} = require('../utils/constant');

const getAllCards = (req, res) => { // получить все карточки
  card.find({}) // поиск всех карточек в бд
    .then((cards) => res.status(OK).json(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => { // создать карточку
  const { name, link } = req.body; // получим из объекта запроса данные для карточки
  const owner = req.user._id; // получить захардкоденный айди юзера
  card.create({ name, link, owner }) // создать карточку в бд
    .then((newCard) => res.status(OK).send(newCard))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорретные данные' });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params; // получим из объекта запроса уникальный id карточки
  card.findByIdAndRemove(cardId) // удалить карточку
    .then((deletedCard) => {
      if (!deletedCard) {
        res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      }
      res.status(OK).send({ message: 'Выполнено' });
    })
    .catch((err) => {
      if ((err.name === 'CastError')) {
        res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' });
      } else { res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }); }
    });
};

const addLike = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((foundCard) => {
      if (!foundCard) { res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' }); }
      res.status(OK).send({ message: 'Выполнено' });
    })
    .catch((err) => {
      if (err.name === 'CastError') { res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' }); }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

const deleteLike = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((foundCard) => {
      if (!foundCard) {
        res.status(NOT_FOUND).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(OK).send({ message: 'Выполнено' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') { res.status(BAD_REQUEST).send({ message: 'Передан некорректный id' }); }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, addLike, deleteLike,
};
