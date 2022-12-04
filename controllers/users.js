const user = require('../models/user');// импортируем модель(схему) юзера

const getAllUsers = (req, res) => {
    user.find({})
        .then(users => res.status(200).send({ data: users }))
        .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const getUser = (req, res) => {
    user.findById(req.params.id)
        .then(user => {
            if (user === null) { res.status(400).send({ "message": "Пользователь не найден" }) }
            else { { res.status(200).send(user) } }
        }).catch(err =>
            res.status(500).send({ "message": `Произошла ошибка ${err}` }));
}


const createUser = (req, res) => {
    const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя
    user.create({ name, about, avatar }).then((newUser) => res.status(200).send(newUser))
        .catch((err) => {
            if ((err.message.includes("validation failed"))) {
                res.status(400).send({ "message": `Произошла ошибка ${err}` })
            }
            else { res.status(500).send({ "message": `Произошла ошибка ${err}` }) }
        });
};

const updateAvatar = (req, res) => {
    const { avatar } = req.body; // получим из объекта запроса аватар
    user.findByIdAndUpdate(req.user._id,

        {
            avatar: avatar,
        },

        {
            new: true, // обработчик then получит на вход обновлённую запись
            runValidators: true, // данные будут валидированы перед изменением
        }

    ).then(() => res.status(200).send("информация обновлена"))
        .catch((err) => {
            if ((err.message.includes("validation failed"))) {
                res.status(400).send({ "message": `Произошла ошибка ${err}` })
            }
            else { res.status(500).send({ "message": `Произошла ошибка ${err}` }) }
        });
};

const updateUser = (req, res) => {
    const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя
    user.findByIdAndUpdate(req.user._id,

        {
            name: name,
            about: about,
        },

        {
            new: true, // обработчик then получит на вход обновлённую запись
            runValidators: true, // данные будут валидированы перед изменением
            upsert: true // если пользователь не найден, он будет создан
        }

    ).then(() => res.status(200).send("информация обновлена"))
        .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports = { getUser, getAllUsers, createUser, updateAvatar, updateUser }
