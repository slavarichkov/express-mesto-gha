const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: { // требования к имени в схеме:
        type: String, // это строка
        required: true, //  обязательное поле
        minlength: 2, // минимальная длина имени — 2 символа
        maxlength: 30, // а максимальная — 30 символов
    },
    link: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.ObjectId,
        required: true,
    },
    likes: {
        type: [mongoose.ObjectId],
        default: [],
    },
    createdAt: {
        date: { type: Date, default: Date.now },
    }
});

module.exports = mongoose.model('card', cardSchema); 