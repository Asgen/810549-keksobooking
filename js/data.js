'use strict';
(function () {
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

  // Функция удаления элемента по нажатию на Esc
  var onEscRemove = function (element) {
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.data.consts.ESC_KEYCODE) {
        element.remove();
      }
    });
  };

  // Функция удаления элемента по клику
  var onClickRemoveThis = function (element) {
    element.addEventListener('click', function () {
      element.remove();
    });
  };

  // Функция отрисовки сообщения из шаблона
  var showMessage = function (templateId, templateElement, target) {
    var container = document.querySelector(target);
    var messageTemplate = document.querySelector(templateId)
      .content
      .querySelector(templateElement);
    var message = messageTemplate.cloneNode(true);
    container.appendChild(message);

    onEscRemove(message);
    onClickRemoveThis(message);
  };

  // Callback функция при успешной загрузке данных
  var onSuccessGet = function (xhr) {
    window.data.objects = xhr.response;
    // Отрисовка Меток на карте
    window.renderPins(window.data.objects, '.map__pins', '#pin', '.map__pin');
  };

  // Callback функция при ошибке загрузки данных
  var onError = function () {
    // Показывает сообщение об ошибке отправки (логика закрытия внутри)
    window.data.funcs.showMessage('#error', '.error', 'main');
  };


  window.data = {
    consts: {
      PIN_WIDTH: PIN_WIDTH,
      PIN_HEIGHT: PIN_HEIGHT,
      PIN_MAIN_WIDTH: PIN_MAIN_WIDTH,
      HEIGHT_MIN: HEIGHT_MIN,
      HEIGHT_MAX: HEIGHT_MAX,
      WIDTH_MAX: WIDTH_MAX,
      CARD_PIC_HEIGHT: CARD_PIC_HEIGHT,
      CARD_PIC_WIDTH: CARD_PIC_WIDTH,
      ESC_KEYCODE: ESC_KEYCODE,
      ENTER_KEYCODE: ENTER_KEYCODE
    },

    funcs: {
      onEscRemove: onEscRemove,
      onClickRemoveThis: onClickRemoveThis,
      showMessage: showMessage,
      onSuccessGet: onSuccessGet,
      onError: onError
    }
  };
})();
