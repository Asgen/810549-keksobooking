// Файл load.js
'use strict';

(function () {
  window.load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
    xhr.send();
  }
})();

(function () {
  window.send = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();



    xhr.open('POST', 'https://js.dump.academy/keksobooking');
     xhr.send();
  }
})();

// Файл main.js
'use strict';
(function () {
  var onError = function (message) {
    console.error(message);
  };

  var onSuccess = function (data) {
    console.log(data);
  };

  window.load(onSuccess, onError);
})();
