'use strict';

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
      if (mainPinPositionY < window.data.Size.HEIGHT_MIN - window.data.Size.PIN_HEIGHT) {
        mainPinPositionY = window.data.Size.HEIGHT_MIN - window.data.Size.PIN_HEIGHT;
      } else if (mainPinPositionY > window.data.Size.HEIGHT_MAX - window.data.Size.PIN_HEIGHT) {
        mainPinPositionY = window.data.Size.HEIGHT_MAX - window.data.Size.PIN_HEIGHT;
      }
      while (mainPinPositionX < 0) {
        mainPinPositionX = 0;
      }
      while (mainPinPositionX > window.data.Size.WIDTH_MAX - window.data.Size.PIN_MAIN_WIDTH) {
        mainPinPositionX = window.data.Size.WIDTH_MAX - window.data.Size.PIN_MAIN_WIDTH;
      }

      // Задает позицию метки
      pinMainHandle.style.top = mainPinPositionY + 'px';
      pinMainHandle.style.left = mainPinPositionX + 'px';

      // Устанавливает адрес во время перетаскивания
      var addressX = mainPinPositionX;
      var addressY = mainPinPositionY + window.data.Size.PIN_HEIGHT;
      address.value = addressX + ',' + addressY;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // Если было перетаскивание
      if (dragged) {
        var pinList = document.querySelectorAll('.map__pin');

        // Если меток на карте нет, то
        if (pinList.length < 2) {
          // Скачивает данные и при успехе вызывает onSuccessGet, которая отрисовывает метки
          window.xhrRequest('https://js.dump.academy/keksobooking/data', 'GET', window.data.funcs.onSuccessGet, window.data.funcs.onError);
          // Удаляет класс карты
          document.querySelector('.map').classList.remove('map--faded');
          // Удаляет класс формы
          document.querySelector('.ad-form').classList.remove('ad-form--disabled');
          // Активирует формы
          window.formToggle.toggle(false);
        }
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
