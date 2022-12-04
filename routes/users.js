const { getUser, getAllUsers, createUser, updateAvatar, updateUser } = require('../controllers/users'); // импортируем контроллеры пользователей
const router = require('express').Router(); // создали роутер

router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUser); //обновляет профиль
router.patch('/users/me/avatar', updateAvatar); //обновляет аватар

module.exports = router; // экспортировали роутер 