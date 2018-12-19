// Файл load.js
'use strict';
(function () {
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
    xhr.send();
  }
})();

var onSuccessGet = function (xhr) {
  console.log('Скачал данные' + ' ' + xhr.status);
  window.data.objects = xhr.response;
};
var onError = function (xhr) {
  console.log('ошибка получения данных');
};

window.load(onSuccessGet);
