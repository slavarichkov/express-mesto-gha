const card = require('../models/card');// импортируем модель(схему) карточки

const getAllCards = (req, res) => {  // получить все карточки
    card.find({}) // поиск всех карточек в бд
        .then((cards) => res.status(200).json(cards))
        .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }))
}

const createCard = (req, res) => {  // создать карточку
    const { name, link } = req.body; // получим из объекта запроса данные для карточки
    const owner = '6389a6305892c3c9822d8829'; // получить захардкоденный айди юзера
    card.create({ name, link, owner }) // создать карточку в бд
        .then((newCard) => res.status(200).send(newCard))
        .catch((err) => {
            if ((err)) {
                res.status(404).send({ "message": `Произошла ошибка ${err}` })
            }
            else { res.status(500).send({ "message": `Произошла ошибка ${err}` }) }
        });
}

const deleteCard = (req, res) => {
    const cardId = req.params.cardId; // получим из объекта запроса уникальный id карточки
    card.findByIdAndRemove(cardId) // удалить карточку
        .then((infoCard) => { res.status(200).send({ message: `Выполнено` }) })
        .catch((err) => { res.status(500).send({ message: `Произошла ошибка ${err}` }) })
}

const addLike = (req, res) => {
    card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
        { new: true },
    )
        .then(() => { res.status(200).send({ message: `Выполнено` }) })
        .catch((err) => { res.status(500).send({ message: `Произошла ошибка ${err}` }) })
}

const deleteLike = (req, res) => {
    card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true },
    )
        .then(() => { res.status(200).send({ message: `Выполнено` }) })
        .catch((err) => { res.status(500).send({ message: `Произошла ошибка ${err}` }) })
}

module.exports = { getAllCards, createCard, deleteCard, addLike, deleteLike };