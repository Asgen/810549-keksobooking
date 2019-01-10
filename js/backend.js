'use strict';
(function () {
  // Экспорт функции запроса на сервер
  window.xhrRequest = function (url, method, onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function (evt) {
      onSuccess(xhr, evt);
    });

    xhr.addEventListener('error', function () {
      onError(xhr);
    });

    xhr.open(method, url);

    xhr.timeout = 5000;
    xhr.addEventListener('timeout', function () {
      onError(xhr);
    });

    data = data || '';

    xhr.send(data);
  };
})();
