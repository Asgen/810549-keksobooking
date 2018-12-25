'use strict';
(function () {
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

    // Функция удаления карточки если есть
    var deleteOldCard = function () {
      var openedCard = document.querySelector('.map__card');
      if (openedCard) {
        openedCard.remove();
      }
    };

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
        deleteOldCard();

        var cardElement = window.renderCard('#card', '.map__card', card);

        // Перед чем вставлять Карточку (в map)
        var mapFilters = document.querySelector('.map__filters-container');
        var map = document.querySelector('.map');
        map.insertBefore(cardElement, mapFilters);
      });
    };
    // --------------------------------

    deleteOldCard();

    // Удаляет метки если были отрисованы ранее
    var pins = pinListElement.querySelectorAll('.map__pin');
    for (var i = 1; i < pins.length; i++) {
      pins[i].remove();
    }

    // Создание метки, только если присутствует свойство offer
    if (dataArr.length > 5) {
      dataArr = dataArr.slice(5);
    }

    for (var i = 0; i < dataArr.length; i++) {
      if (dataArr[i].offer) {
        var pinElement = pinTemplate.cloneNode(true);
        var pinPositionX = (dataArr[i].location.x <= window.data.consts.PIN_WIDTH) ? dataArr[i].location.x : dataArr[i].location.x - window.data.consts.PIN_WIDTH;
        var pinPositionY = (dataArr[i].location.y <= window.data.consts.PIN_HEIGHT) ? dataArr[i].location.y - window.data.consts.PIN_HEIGHT / 2 : dataArr[i].location.y;
        pinElement.style.left = pinPositionX + 'px';
        pinElement.style.top = pinPositionY + 'px';
        var pinAvatar = pinElement.firstChild;
        pinAvatar.src = dataArr[i].author.avatar;

        onPinClick(pinElement, dataArr[i]);

        // Добавление в список
        fragmentPins.appendChild(pinElement);
      }
    }
    // Добавляет фрагмент с метками в список меток
    pinListElement.appendChild(fragmentPins);
  };

  window.renderPins = renderPins;
})();
