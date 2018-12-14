'use strict';

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

// Мапа для минимальной цены
var minPriceFromType = {
  'palace': 10000,
  'flat': 1000,
  'house': 5000,
  'bungalo': 0
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
  var addPinClickHandler = function (pin, card) {
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
    var pinPositionY = (dataArr[i].location.y <= PIN_HEIGHT) ? dataArr[i].location.y - PIN_HEIGHT / 2 : dataArr[i].location.y;
    pinElement.style.left = pinPositionX + 'px';
    pinElement.style.top = pinPositionY + 'px';
    var pinAvatar = pinElement.firstChild;
    pinAvatar.src = dataArr[i].author.avatar;

    addPinClickHandler(pinElement, objects[i]);

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
// принимает true or false
var makeAllFormsDisable = function (status) {
  var fieldsets = document.querySelectorAll('fieldset');
  var selects = document.querySelectorAll('.map__filters select');

  var disableIt = function (arr, statusx) {
    for (i = 0; i < arr.length; i++) {
      arr[i].disabled = statusx;
    }
  };
  disableIt(fieldsets, status);
  disableIt(selects, status);
};

// Деактивируем все поля
makeAllFormsDisable(true);

// Валидация формы--------------------------------------------

// Кнопка reset
var adForm = document.querySelector('.ad-form');
var resetButton = adForm.querySelector('.ad-form__reset');

var onResetButtonClick = function (evt) {
  evt.preventDefault();

  // Блокирует карту
  var map = document.querySelector('.map');
  map.classList.add('map--faded');

  // Блокирует форму
  adForm.classList.add('ad-form--disabled');
  // Блокирует поля
  makeAllFormsDisable(true);
  // Удаляет все отрисованные метки
  var pinListo = document.querySelectorAll('.map__pin');
  for (i = 1; i < pinListo.length; i++) {
    pinListo[i].remove();
  }
  // Удаляет карточку, если открыта
  var openedCard = document.querySelector('.map__card');
  if (openedCard) {
    openedCard.remove();
  }

  // Сбрасывает форму и скролит вверх страницы
  adForm.reset();
  document.documentElement.scrollTop = 0;
  onRoomSelectClick();

  // Ставит метку посередине карты
  pinListo[0].style.top = map.offsetHeight / 2 + 'px';
  pinListo[0].style.left = (map.offsetWidth / 2) - (PIN_MAIN_WIDTH / 2) + 'px';
  // Прописывает адрес
  var address = document.querySelector('#address');
  address.value = pinListo[0].offsetLeft + ',' + pinListo[0].offsetTop;
};
resetButton.addEventListener('click', onResetButtonClick);

// Зависимость минимальной цены от типа
var priceInput = document.querySelector('#price');
var typeInput = document.querySelector('#type');

typeInput.addEventListener('click', function () {
  var minPrice = typeInput.value;
  priceInput.min = minPriceFromType[minPrice];
  priceInput.placeholder = priceInput.min;
});

// Связь полей времени въезда и выезда
var timeInInput = document.querySelector('#timein');
var timeOutInput = document.querySelector('#timeout');
var timeFieldset = document.querySelector('.ad-form__element--time');

timeFieldset.addEventListener('click', function (event) {
  var target = event.target; // где был клик?
  if (target === timeInInput) {
    timeOutInput.selectedIndex = timeInInput.selectedIndex;
  } else {
    timeInInput.selectedIndex = timeOutInput.selectedIndex;
  }
});

// Количество гостей зависит от количества комнат
var roomSelect = document.querySelector('#room-number');
var guestsSelect = document.querySelector('#capacity');

for (i = 1; i < (guestsSelect.length); i++) {
  guestsSelect.options[i].disabled = true;
}

var onRoomSelectClick = function () {
  // Количество комнат прямопропорционально количеству гостей
  for (i = 0; i < guestsSelect.length; i++) {
    guestsSelect.options[i].disabled = false;
    if (i > roomSelect.selectedIndex) {
      guestsSelect.options[i].disabled = true;
    }
    if (roomSelect.selectedIndex === 3) {
      guestsSelect.options[i].disabled = true;
      guestsSelect.options[3].disabled = false;
    }
    guestsSelect.selectedIndex = roomSelect.selectedIndex;
  }
};
roomSelect.addEventListener('click', onRoomSelectClick);
// -------------------------------------------валидация формы

// Перетаскивание главной метки
(function () {
  var pinMainHandle = document.querySelector('.map__pin--main');

  // Устанавливает адрес
  var address = document.querySelector('#address');
  address.readOnly = true;
  address.value = pinMainHandle.offsetLeft + ',' + pinMainHandle.offsetTop;

  pinMainHandle.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Начальные координаты
    var startCoords = {
      x: evt.pageX,
      y: evt.pageY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      // Смещение
      var shift = {
        x: startCoords.x - moveEvt.pageX,
        y: startCoords.y - moveEvt.pageY
      };

      // Координаты после смещения
      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };

      // Расчет позиции метки при перетаскивании
      var positionX = pinMainHandle.offsetLeft - shift.x;
      var positionY = pinMainHandle.offsetTop - shift.y;

      var mainPinPositionY = positionY;
      var mainPinPositionX = positionX;

      // Позиции метки в крайних точках
      if (mainPinPositionY < HEIGHT_MIN - PIN_HEIGHT) {
        mainPinPositionY = HEIGHT_MIN - PIN_HEIGHT;
      } else if (mainPinPositionY > HEIGHT_MAX - PIN_HEIGHT) {
        mainPinPositionY = HEIGHT_MAX - PIN_HEIGHT;
      }
      while (mainPinPositionX < 0) {
        mainPinPositionX = 0;
      }
      while (mainPinPositionX > WIDTH_MAX - PIN_MAIN_WIDTH) {
        mainPinPositionX = WIDTH_MAX - PIN_MAIN_WIDTH;
      }

      // Задает позицию метки
      pinMainHandle.style.top = mainPinPositionY + 'px';
      pinMainHandle.style.left = mainPinPositionX + 'px';

      // Устанавливает адрес во время перетаскивания
      var addressX = mainPinPositionX;
      var addressY = mainPinPositionY + PIN_HEIGHT;
      address.value = addressX + ',' + addressY;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // Если было перетаскивание
      if (dragged) {
        var pinList = document.querySelectorAll('.map__pin');
        if (pinList.length < 2) {
          // Удаляет класс карты
          document.querySelector('.map').classList.remove('map--faded');
          // Удаляет класс формы
          document.querySelector('.ad-form').classList.remove('ad-form--disabled');
          // Активирует формы
          makeAllFormsDisable(false);
          // Отрисовка Меток на карте
          renderPins(objects, '.map__pins', '#pin', '.map__pin');
        }
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
