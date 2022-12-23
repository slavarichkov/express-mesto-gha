const OK = 200; // OK
const BAD_REQUEST = 400; // переданы некорректные данные
const NOT_FOUND = 404; // карточка или пользователь не найден
const CONFLICT = 409; // конфликт запроса с текущим состоянием сервера
const UNAUTHORIZED = 401; // запрос не был применён
const INTERNAL_SERVER_ERROR = 500; // ошибка по-умолчанию

module.exports = {
  OK, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, CONFLICT, UNAUTHORIZED,
};
