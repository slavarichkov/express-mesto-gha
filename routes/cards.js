const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate'); // Валидация приходящих на сервер данных

const {
  getAllCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards'); // импорт контроллеров

router.get('/cards', getAllCards);

router.post('/cards', celebrate({ // создать карточку
  body: Joi.object().keys({ // применить Валидацию приходящих на сервер данных
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i).required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({ // удалить карточку
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({ // добавить лайк
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), addLike);
router.delete('/cards/:cardId/likes', celebrate({ // убрать лайк
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteLike);

module.exports = router;
