const card = require('../models/card');// импортируем модель(схему) карточки

// Импорт классов ошибок
const BAD_REQUEST_M = require('../utils/mist/BAD_REQUEST');
const INTERNAL_SERVER_ERROR_M = require('../utils/mist/INTERNAL_SERVER_ERROR');
const NOT_FOUND_M = require('../utils/mist/NOT_FOUND');
const FORBIDDEN_M = require('../utils/mist/FORBIDDEN');

const { OK } = require('../utils/constant'); // импортируем коды ошибок

const getAllCards = (req, res) => { // получить все карточки
  card.find({}) // поиск всех карточек в бд
    .then((cards) => res.status(OK).json(cards))
    .catch(() => new INTERNAL_SERVER_ERROR_M('Произошла ошибка'));
};

const createCard = (req, res, next) => { // создать карточку
  const { name, link } = req.body; // получим из объекта запроса данные для карточки
  const owner = req.user._id; // получить айди юзера
  card.create({ name, link, owner }) // создать карточку в бд
    .then((newCard) => res.status(OK).send(newCard))
    .catch((err) => {
      if ((err.name === 'ValidationError')) {
        next(new BAD_REQUEST_M('Переданы некорретные данные'));
      } else { next(err); }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params; // получим из объекта запроса уникальный id карточки
  card.findById(cardId)
    .then((cardFound) => {
      if (!cardFound) {
        throw new NOT_FOUND_M('неверный id карточки');
      } else if (!cardFound.owner.equals(req.user._id)) {
        throw new FORBIDDEN_M('нельзя удалить чужую карточку');
      } else { cardFound.remove(cardId).then(() => res.send({ message: 'Карточка удалена' })).catch(next); }
    })
    .catch(next);
};

const addLike = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((foundCard) => {
      if (!foundCard) { throw new NOT_FOUND_M('Карточка с таким id не найдена'); }
      res.status(OK).send({ message: 'Выполнено' });
    })
    .catch((err) => {
      if (err.name === 'CastError') { throw new BAD_REQUEST_M('Передан некорректный id'); }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((foundCard) => {
      if (!foundCard) {
        throw new NOT_FOUND_M('Карточка с таким id не найдена');
      } else {
        res.status(OK).send({ message: 'Выполнено' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') { next(new BAD_REQUEST_M('Передан некорректный id')); }
      next(err);
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, addLike, deleteLike,
};
