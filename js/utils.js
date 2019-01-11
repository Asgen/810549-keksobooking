'use strict';
(function () {

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

  // Функция удаления элемента по нажатию на Esc
  var onEscRemove = function (element) {
    var esc = window.data.KeyCode.ESC_KEYCODE;
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === esc) {
        element.remove();
      }
    });
    document.removeEventListener('keydown', function (evt) {
      if (evt.keyCode === esc) {
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

  // Функция удаления всех детей элемента
  var removeChildren = function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  // Callback функция при успешной загрузке данных
  var onSuccessGet = function (xhr) {
    window.data.objects = xhr.response;
    // Отрисовка Меток на карте
    window.renderPins(xhr.response, '.map__pins', '#pin', '.map__pin');
  };

  // Callback функция при ошибке загрузки данных
  var onError = function () {
    // Показывает сообщение об ошибке отправки (логика закрытия внутри)
    showMessage('#error', '.error', 'main');
  };

  // Функция устранение дребезга
  var debounce = function (callback, time) {
    var timeout;
    return function () {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(function () {
        timeout = null;
        callback();
      }, time);
    };
  };

  window.funcs = {
    makeElement: makeElement,
    addTextContent: addTextContent,
    removeChildren: removeChildren,
    onEscRemove: onEscRemove,
    onClickRemoveThis: onClickRemoveThis,
    showMessage: showMessage,
    onSuccessGet: onSuccessGet,
    onError: onError,
    debounce: debounce
  };
})();
