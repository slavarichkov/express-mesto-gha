
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { // у пользователя есть имя — опишем требования к имени в схеме:
        type: String, // это строка
        required: true, //  обязательное поле
        minlength: 2, // минимальная длина имени — 2 символа
        maxlength: 30, // а максимальная — 30 символов
    },
    about: {
        type: String,
        minlength: 2, // минимальная длина имени — 2 символа
        maxlength: 30, // а максимальная — 30 символов
        required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    },
    avatar: {
        type: String,
        required: true,
    }
});

const userModel = mongoose.model('user', userSchema); 

module.exports = userModel; 