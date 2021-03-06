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

      var position = window.data.Size;

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
      if (mainPinPositionY < position.HEIGHT_MIN - position.PIN_HEIGHT) {
        mainPinPositionY = position.HEIGHT_MIN - position.PIN_HEIGHT;
      } else if (mainPinPositionY > position.HEIGHT_MAX - position.PIN_HEIGHT) {
        mainPinPositionY = position.HEIGHT_MAX - position.PIN_HEIGHT;
      }
      while (mainPinPositionX < 0) {
        mainPinPositionX = 0;
      }
      while (mainPinPositionX > position.WIDTH_MAX - position.PIN_MAIN_WIDTH) {
        mainPinPositionX = position.WIDTH_MAX - position.PIN_MAIN_WIDTH;
      }

      // Задает позицию метки
      pinMainHandle.style.top = mainPinPositionY + 'px';
      pinMainHandle.style.left = mainPinPositionX + 'px';

      // Устанавливает адрес во время перетаскивания
      var addressX = mainPinPositionX;
      var addressY = mainPinPositionY + position.PIN_HEIGHT;
      address.value = addressX + ',' + addressY;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      var func = window.funcs;
      var disableForms = window.formToggle.toggle;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // Если было перетаскивание
      if (dragged) {
        var data = window.data.objects;

        // При первом взаимодействии с сайтом, пока данные еще не загружены
        if (!data) {
          // Скачивает данные и при успехе вызывает onSuccessGet, которая отрисовывает метки
          window.xhrRequest('https://js.dump.academy/keksobooking/data', 'GET', func.onSuccessGet, func.onError);
        } else {
          // Если данные уже загружены
          window.renderPins(data, '.map__pins', '#pin', '.map__pin');
        }

        // Удаляет класс карты
        document.querySelector('.map').classList.remove('map--faded');
        // Удаляет класс формы
        document.querySelector('.ad-form').classList.remove('ad-form--disabled');
        // Активирует формы
        disableForms(false);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
