const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

const {
  getAllCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards'); // импорт контроллеров

router.get('/cards', getAllCards);

router.post('/cards', celebrate({ // создать карточку
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2),
  }).unknown(true),
}), createCard);

router.delete('/cards/:cardId', deleteCard); // удалить карточку
router.put('/cards/:cardId/likes', addLike); // добавить лайк
router.delete('/cards/:cardId/likes', deleteLike); // убрать лайк

module.exports = router;
