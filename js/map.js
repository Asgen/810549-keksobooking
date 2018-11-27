'use strict';

// Размеры Метки
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var objects = [];
var offers = {
  titles: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],

  types: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],

  times: [
    '12:00',
    '13:00',
    '14:00'
  ],

  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],

  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

// Функция получения случайного числа от min до max
var getRandom = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// Функция получения случайного элемента массива
var getRandomElement = function (arr) {
  var i = getRandom(0, arr.length);
  return arr[i];
};

// Функция создания элемента
var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

// Функция добавление текстового содержимого элементу родителя
var addTextContent = function (parent, elementClass, text) {
  var element = parent.querySelector(elementClass);
  element.textContent = text;
};

// Функция удаления всех детей элемента
var removeChildren = function (parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
};

// Функция создания объекта.
// Принимает ссылку на аватарку и заголовок.
// Возвращает объект с 3 объектами: author, location, offer
var makeObject = function (avatar, title) {
  var object = {};

  object.author = {};
  object.author.avatar = avatar;

  object.location = {};
  object.location.x = getRandom(0, document.body.offsetWidth);
  object.location.y = getRandom(130, 630);

  object.offer = {};
  object.offer.title = title;
  object.offer.address = object.location.x + ',' + object.location.y;
  object.offer.price = getRandom(1000, 1000000);
  object.offer.type = getRandomElement(offers.types);
  object.offer.rooms = getRandom(1, 6);
  object.offer.guests = getRandom(0, 16);
  object.offer.checkin = getRandomElement(offers.times);
  object.offer.checkout = getRandomElement(offers.times);
  // Случайная длина массива строк от 1 до длины исходного массива
  object.offer.features = offers.features.slice(0, getRandom(1, offers.features.length));
  object.offer.description = '';
  object.offer.photos = offers.photos.slice();

  return object;
};

// Цикл, формирует массив объектов
// созданных с помощью функции создания объекта
for (var i = 0; i < 8; i++) {
  var avatarLink = 'img/avatars/user0' + (i + 1) + '.png';
  var offerTitle = offers.titles[i];
  objects.push(makeObject(avatarLink, offerTitle));
}

// Удаляет класс карты
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Куда вставлять Метки
var pinListElement = document.querySelector('.map__pins');
// Перед чем вставлять Карточку (в map)
var mapFilters = document.querySelector('.map__filters-container');

// Переменные для хранения Метки и Карточки
// берутся из шаблона
var pinTamplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var cardTamplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

// Отрисовка Меток на карте
var fragmentPins = document.createDocumentFragment();
for (i = 0; i < objects.length; i++) {
  var pinElement = pinTamplate.cloneNode(true);

  var pinPositionX = (objects[i].location.x <= PIN_WIDTH) ? objects[i].location.x : objects[i].location.x - PIN_WIDTH;
  var pinPositionY = (objects[i].location.y <= PIN_HEIGHT) ? objects[i].location.y : objects[i].location.y - PIN_HEIGHT;
  pinElement.style.left = pinPositionX + 'px';
  pinElement.style.top = pinPositionY + 'px';

  var pinAvatar = pinElement.firstChild;
  pinAvatar.src = objects[i].author.avatar;

  fragmentPins.appendChild(pinElement);
}

// Добавляет фрагмент с метками в список меток
pinListElement.appendChild(fragmentPins);

// Отрисовка Карточки
var cardElement = cardTamplate.cloneNode(true);

addTextContent(cardElement, '.popup__title', objects[0].offer.title);
addTextContent(cardElement, '.popup__text--address', objects[0].offer.address);
addTextContent(cardElement, '.popup__text--price', objects[0].offer.price + ' ₽/ночь');
addTextContent(cardElement, '.popup__text--capacity', objects[0].offer.rooms + ' комнаты для ' + objects[0].offer.guests + ' гостей');
addTextContent(cardElement, '.popup__text--time', 'Заезд после ' + objects[0].offer.checkin + ', выезд до ' + objects[0].offer.checkout);
addTextContent(cardElement, '.popup__description', objects[0].offer.description);

var cardType = cardElement.querySelector('.popup__type');
if (objects[0].offer.type === 'palace') {
  cardType.textContent = 'Дворец';
} else if (objects[0].offer.type === 'flat') {
  cardType.textContent = 'Квартира';
} else if (objects[0].offer.type === 'house') {
  cardType.textContent = 'Дом';
} else if (objects[0].offer.type === 'bungalo') {
  cardType.textContent = 'Бунгало';
}

var cardFeatures = cardElement.querySelector('.popup__features');
removeChildren(cardFeatures);
for (i = 0; i < objects[0].offer.features.length; i++) {
  var cardFeature = makeElement('li', 'popup__feature');
  var cardFeatureMod = 'popup__feature--' + objects[0].offer.features[i];
  cardFeature.classList.add(cardFeatureMod);

  cardFeatures.appendChild(cardFeature);
}

var cardPhotos = cardElement.querySelector('.popup__photos');
removeChildren(cardPhotos);
for (i = 0; i < objects[0].offer.photos.length; i++) {
  var cardPhoto = makeElement('img', 'popup__photo');
  cardPhoto.width = 45;
  cardPhoto.height = 40;
  cardPhoto.src = objects[0].offer.photos[i];

  cardPhotos.appendChild(cardPhoto);
}

var cardAvatar = cardElement.querySelector('.popup__avatar');
cardAvatar.src = objects[0].author.avatar;

map.insertBefore(cardElement, mapFilters);
