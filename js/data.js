'use strict';
(function () {
  // Количество генерируемых объектов
  var OBJECTS_QUANTITY = 8;

  // Размеры Метки
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_MAIN_WIDTH = 63;

  // Размер контейнера меток
  var HEIGHT_MIN = 130;
  var HEIGHT_MAX = 630;
  var WIDTH_MAX = document.body.offsetWidth;

  // Размеры фото в карточке
  var CARD_PIC_WIDTH = 45;
  var CARD_PIC_HEIGHT = 40;

  // Параметры
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var ROOMS_MIN = 1;
  var ROOMS_MAX = 6;
  var GUESTS_MIN = 1;
  var GUESTS_MAX = 50;

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

  // Функция перемешивания массива
  var shuffleArr = function shuffle(arr) {
    var j;
    var temp;
    for (var i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
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

  // Функция создания объекта.
  // Принимает ссылку на аватарку и заголовок.
  // Возвращает объект с 3 объектами: author, location, offer
  var makeObject = function (avatar, title) {
    var locationX = getRandom(0, WIDTH_MAX);
    var locationY = getRandom(HEIGHT_MIN, HEIGHT_MAX);

    var object = {
      author: {
        avatar: avatar
      },

      location: {
        x: locationX,
        y: locationY
      },

      offer: {
        title: title,
        address: locationX + ',' + locationY,
        price: getRandom(PRICE_MIN, PRICE_MAX),
        type: getRandomElement(offers.types),
        rooms: getRandom(ROOMS_MIN, ROOMS_MAX),
        guests: getRandom(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomElement(offers.times),
        checkout: getRandomElement(offers.times),
        // Случайная длина массива строк от 1 до длины исходного массива
        features: offers.features.slice(0, getRandom(1, offers.features.length)),
        description: '',
        photos: shuffleArr(offers.photos)
      }
    };

    return object;
  };

  // Цикл, формирует массив объектов
  // созданных с помощью функции создания объекта
  for (var i = 0; i < OBJECTS_QUANTITY; i++) {
    var avatarLink = 'img/avatars/user0' + (i + 1) + '.png';
    var offerTitle = offers.titles[i];
    objects.push(makeObject(avatarLink, offerTitle));
  }

  window.data = {
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    PIN_MAIN_WIDTH: PIN_MAIN_WIDTH,
    HEIGHT_MIN: HEIGHT_MIN,
    HEIGHT_MAX: HEIGHT_MAX,
    WIDTH_MAX: WIDTH_MAX,
    CARD_PIC_HEIGHT: CARD_PIC_HEIGHT,
    CARD_PIC_WIDTH: CARD_PIC_WIDTH,
    //objects: objects
  };
})();
