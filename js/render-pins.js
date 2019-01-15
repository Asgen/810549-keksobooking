'use strict';
(function () {
  // Функция удаления карточки если есть
  var deleteOldCard = function () {
    var openedCard = document.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
  };

  // Функция поведение при клике на метку
  var onPinClick = function (pin, card) {
    var renderCard = window.renderCard;

    pin.addEventListener('click', function () {
      // Добавление класса активной метке
      var activePin = document.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      pin.classList.add('map__pin--active');

      // Отрисовка только одной карточки
      deleteOldCard();

      var cardElement = renderCard('#card', '.map__card', card);

      // Перед чем вставлять Карточку (в map)
      var mapFilters = document.querySelector('.map__filters-container');
      var map = document.querySelector('.map');
      map.insertBefore(cardElement, mapFilters);
    });
  };

  // Удаляет метки из pinListElement
  var cleanPins = function (pinListElement) {
    var pins = pinListElement.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (element) {
      element.remove();
    });
  };

  // Функция отрисовки Меток на карте
  // На входе: массив объектов, куда вставлять метки,
  // Id шабона, класс элемента для коп-ия
  var renderPins = function (dataArr, targetList, templateId, templateClass) {
    var size = window.data.Size;
    var maxPins = window.data.MAX_PINS;

    // Куда вставлять Метки
    var pinListElement = document.querySelector(targetList);
    // Переменная для хранения Метки из шаблона
    var pinTemplate = document.querySelector(templateId)
      .content
      .querySelector(templateClass);
    // Фрагмент куда будет добавлять метки
    var fragmentPins = document.createDocumentFragment();

    deleteOldCard();
    cleanPins(pinListElement);

    // Ограничение по кол-ву меток на карте
    if (dataArr.length > maxPins) {
      dataArr = dataArr.slice(0, maxPins);
    }

    dataArr.forEach(function (element) {
      // Создание метки, только если присутствует свойство offer
      if (element.offer) {
        var pinElement = pinTemplate.cloneNode(true);
        var pinPositionX = (element.location.x <= size.PIN_WIDTH) ? element.location.x : element.location.x - size.PIN_WIDTH;
        var pinPositionY = (element.location.y <= size.PIN_HEIGHT) ? element.location.y - size.PIN_HEIGHT / 2 : element.location.y;
        pinElement.style.left = pinPositionX + 'px';
        pinElement.style.top = pinPositionY + 'px';
        var pinAvatar = pinElement.firstChild;
        pinAvatar.src = element.author.avatar;

        onPinClick(pinElement, element);

        // Добавление в список
        fragmentPins.appendChild(pinElement);
      }
    });


    // Добавляет фрагмент с метками в список меток
    pinListElement.appendChild(fragmentPins);
  };

  window.renderPins = renderPins;
})();
