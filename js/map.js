'use strict';

// Количество генерируемых объектов
var OBJECTS_QUANTITY = 8;

// Размеры Метки
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

// Размер контейнера меток
var HEIGHT_MIN = 130;
var HEIGHT_MAX = 630;
var WIDTH_MAX = document.body.offsetWidth;

// Параметры
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 6;
var GUESTS_MIN = 1;
var GUESTS_MAX = 50;

// Размеры фото в карточке
var CARD_PIC_WIDTH = 45;
var CARD_PIC_HEIGHT = 40;


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

// Мапа для типа жилья отрисованной карточки
var cardTypeTranslated = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

// Функция получения левого маргина body, возвращает число
var getBodyMargin = function () {
  var body = document.querySelector('body');
  var style = body.currentStyle || window.getComputedStyle(body);

  return parseInt(style.marginLeft, 10);
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

// Функция отрисовки Меток на карте
// На входе: массив объектов, куда вставлять метки,
// Id шабона, класс элемента для коп-ия
var renderPins = function (dataArr, targetList, templateId, templateClass) {
  // Куда вставлять Метки
  var pinListElement = document.querySelector(targetList);
  // Переменная для хранения Метки из шаблона
  var pinTemplate = document.querySelector(templateId)
    .content
    .querySelector(templateClass);
  // Фрагмент куда будет добавлять метки
  var fragmentPins = document.createDocumentFragment();

  // Функция поведение при клике на метку
  var onPinClick = function (pin, card) {
    pin.addEventListener('click', function () {
      // Добавление класса активной метке
      var activePin = document.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      pin.classList.add('map__pin--active');

      // Отрисовка только одной карточки
      var openedCard = document.querySelector('.map__card');
      if (openedCard) {
        openedCard.remove();
      }
      var cardElement = renderCard('#card', '.map__card', card);

      // Перед чем вставлять Карточку (в map)
      var mapFilters = document.querySelector('.map__filters-container');
      var map = document.querySelector('.map');
      map.insertBefore(cardElement, mapFilters);
    });
  };
  // --------------------------------

  for (var i = 0; i < dataArr.length; i++) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinPositionX = (dataArr[i].location.x <= PIN_WIDTH) ? dataArr[i].location.x : dataArr[i].location.x - PIN_WIDTH;
    var pinPositionY = (dataArr[i].location.y <= PIN_HEIGHT) ? dataArr[i].location.y : dataArr[i].location.y - PIN_HEIGHT;
    pinElement.style.left = pinPositionX + 'px';
    pinElement.style.top = pinPositionY + 'px';
    var pinAvatar = pinElement.firstChild;
    pinAvatar.src = dataArr[i].author.avatar;

    onPinClick(pinElement, objects[i]);

    // Добавление в список
    fragmentPins.appendChild(pinElement);
  }
  // Добавляет фрагмент с метками в список меток
  pinListElement.appendChild(fragmentPins);
};

// Функция отрисовки карточки
// возвращает карточку
var renderCard = function (templateId, templateClass, dataElement) {
  var cardTemplate = document.querySelector(templateId)
    .content
    .querySelector(templateClass);
  var cardElement = cardTemplate.cloneNode(true);

  addTextContent(cardElement, '.popup__title', dataElement.offer.title);
  addTextContent(cardElement, '.popup__text--address', dataElement.offer.address);
  addTextContent(cardElement, '.popup__text--price', dataElement.offer.price + ' ₽/ночь');
  addTextContent(cardElement, '.popup__text--capacity', dataElement.offer.rooms + ' комнаты для ' + dataElement.offer.guests + ' гостей');
  addTextContent(cardElement, '.popup__text--time', 'Заезд после ' + dataElement.offer.checkin + ', выезд до ' + dataElement.offer.checkout);
  addTextContent(cardElement, '.popup__description', dataElement.offer.description);

  var cardType = cardElement.querySelector('.popup__type');
  cardType.textContent = cardTypeTranslated[dataElement.offer.type];

  var cardFeatures = cardElement.querySelector('.popup__features');
  removeChildren(cardFeatures);
  for (i = 0; i < dataElement.offer.features.length; i++) {
    var cardFeature = makeElement('li', 'popup__feature');
    var cardFeatureMod = 'popup__feature--' + dataElement.offer.features[i];
    cardFeature.classList.add(cardFeatureMod);

    cardFeatures.appendChild(cardFeature);
  }

  var cardPhotos = cardElement.querySelector('.popup__photos');
  removeChildren(cardPhotos);
  for (i = 0; i < dataElement.offer.photos.length; i++) {
    var cardPhoto = makeElement('img', 'popup__photo');
    cardPhoto.width = CARD_PIC_WIDTH;
    cardPhoto.height = CARD_PIC_HEIGHT;
    cardPhoto.src = dataElement.offer.photos[i];

    cardPhotos.appendChild(cardPhoto);
  }

  var cardAvatar = cardElement.querySelector('.popup__avatar');
  cardAvatar.src = dataElement.author.avatar;

  // Поведение при клике
  var closeButton = cardElement.querySelector('.popup__close');
  closeButton.addEventListener('click', function () {
    cardElement.remove();
  });

  return cardElement;
};

// Цикл, формирует массив объектов
// созданных с помощью функции создания объекта
for (var i = 0; i < OBJECTS_QUANTITY; i++) {
  var avatarLink = 'img/avatars/user0' + (i + 1) + '.png';
  var offerTitle = offers.titles[i];
  objects.push(makeObject(avatarLink, offerTitle));
}

// Функция активации/деактивации полей ввода
// принимает строку со значение on или off
var makeAllFormsOnOrOff = function (status) {
  var fieldsets = document.querySelectorAll('fieldset');
  var selects = document.querySelectorAll('.map__filters select');

  if (status === 'off') {
    for (i = 0; i < fieldsets.length; i++) {
      fieldsets[i].setAttribute('disabled', 'disabled');
    }
    for (i = 0; i < selects.length; i++) {
      selects[i].setAttribute('disabled', 'disabled');
    }
  }

  if (status === 'on') {
    for (i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled', 'disabled');
    }
    for (i = 0; i < selects.length; i++) {
      selects[i].removeAttribute('disabled', 'disabled');
    }
  }

};

// Функция удаления класса
var removeClass = function (elementClass, classToRemove) {
  var element = document.querySelector(elementClass);
  element.classList.remove(classToRemove);
};

// Деактивируем все поля
makeAllFormsOnOrOff('off');
// Хранитель
var itWas;


// -----------------------------------------------------------
// Перетаскивание главной метки
(function () {
  var pinMainHandle = document.querySelector('.map__pin--main');

  pinMainHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Начальные координаты
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      pinMainHandle.style.top = (pinMainHandle.offsetTop - shift.y) + 'px';
      pinMainHandle.style.left = (pinMainHandle.offsetLeft - shift.x) + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // Если было перетаскивание
      if (dragged) {
        // Выполняется один раз
        if (!itWas) {
          // Удаляет класс карты
          removeClass('.map', 'map--faded');
          // Удаляет класс формы
          removeClass('.ad-form', 'ad-form--disabled');
          // Активирует формы
          makeAllFormsOnOrOff('on');
          // Отрисовка Меток на карте
          renderPins(objects, '.map__pins', '#pin', '.map__pin');

          itWas = true;
        }

        // Устанавливает адрес
        var address = document.querySelector('#address');
        address.setAttribute('disabled', 'disabled');
        var addressX = (upEvt.clientX - (PIN_WIDTH / 2) - getBodyMargin()) < 0 ? 0 : upEvt.clientX - (PIN_WIDTH / 2) - getBodyMargin();
        var addressY = upEvt.clientY < 0 ? 0 : upEvt.clientY;
        address.value = addressX + ',' + addressY;
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();

