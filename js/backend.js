'use strict';
(function () {
  // Экспорт функции скачивания данных
  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onSuccess(xhr);
    });

    xhr.addEventListener('error', function () {
      onError(xhr);
    });

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');

    xhr.timeout = 1000;
    xhr.addEventListener('timeout', function () {
      onError(xhr);
    });

    xhr.send();
  };

  // Экспорт функции отправки дынных
  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function (evt) {
      onSuccess(xhr, evt);
    });

    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.open('POST', 'https://js.dump.academy/keksobooking');
    xhr.send(data);
  };
})();
