const router = require('express').Router(); // создали роутер
const { getAllCards, createCard, deleteCard, addLike, deleteLike } = require('../controllers/cards')// импорт контроллеров

router.get('/cards', getAllCards); // получить все карточки
router.post('/cards', createCard); // создаёт карточку
router.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору
router.put('/cards/:cardId/likes', addLike); // поставить лайк карточке
router.delete('/cards/:cardId/likes', deleteLike); // убрать лайк с карточки

module.exports = router;