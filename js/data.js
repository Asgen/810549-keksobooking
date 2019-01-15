'use strict';
(function () {
  // Максимальное количество меток на карте
  var MAX_PINS = 5;

  // Самое большое количество комнат
  var MAX_ROOMS = '100';

  // Количество гостей для MAX_ROOMS
  var GUESTS_FOR_MAX_ROOMS = 0;

  // Ценники объявлений
  var LOW = 10000;
  var MIDDLE = 50000;
  var HIGH = Infinity;

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

  // Коды клавиш
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.data = {
    MAX_PINS: MAX_PINS,
    MAX_ROOMS: MAX_ROOMS,
    GUESTS_FOR_MAX_ROOMS: GUESTS_FOR_MAX_ROOMS,

    KeyCode: {
      ESC_KEYCODE: ESC_KEYCODE,
      ENTER_KEYCODE: ENTER_KEYCODE
    },

    Size: {
      PIN_WIDTH: PIN_WIDTH,
      PIN_HEIGHT: PIN_HEIGHT,
      PIN_MAIN_WIDTH: PIN_MAIN_WIDTH,
      HEIGHT_MIN: HEIGHT_MIN,
      HEIGHT_MAX: HEIGHT_MAX,
      WIDTH_MAX: WIDTH_MAX,
      CARD_PIC_HEIGHT: CARD_PIC_HEIGHT,
      CARD_PIC_WIDTH: CARD_PIC_WIDTH
    },

    AdPrice: {
      LOW: LOW,
      MIDDLE: MIDDLE,
      HIGH: HIGH
    },

    // Мапа для типа жилья отрисованной карточки
    cardTypeMap: {
      'palace': 'Дворец',
      'flat': 'Квартира',
      'house': 'Дом',
      'bungalo': 'Бунгало'
    }
  };
})();
