const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/constant'); // импортируем контроллеры пользователей

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достать авторизационный заголовок

  if (!authorization || !authorization.startsWith('Bearer ')) { // Проверить есть ли заголовок или начинается ли с Bearer
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', ''); // убрать Bearer
  let payload; // объявляем payload

  try {
    payload = jwt.verify(token, 'e70c5d15f42ff6749dd9a1140d7efc49'); // Верифицируем токен, Метод принимает на вход два параметра — токен и секретный ключ, которым этот токен был подписан, вернёт пейлоуд токена, если тот прошёл проверку
  } catch (err) {
    res
      .status(UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};