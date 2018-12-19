// Файл load.js
'use strict';
(function () {
  window.upload = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onSuccess(xhr);
    });

    xhr.addEventListener('error', function () {
      onError(xhr);
    });

    xhr.open('POST', 'https://js.dump.academy/keksobooking');
    xhr.send(data);
  }
})();


var form = document.querySelector('.ad-form');

var onSuccessSend = function (xhr) {
  console.log('отправлено');
  form.reset();
};

var onError = function (xhr) {
  console.log('ошибка отправки данных');
};

form.addEventListener('submit', function (evt) {
  window.upload(new FormData(form), onSuccessSend, onError);
  evt.preventDefault();
});
