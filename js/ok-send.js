// Файл load.js
'use strict';
(function () {
  window.upload = function (data, onSuccess) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onSuccess(xhr.response);
      console.log(xhr.status);
      console.log(xhr.response);
    });

    xhr.open('POST', 'https://js.dump.academy/keksobooking');

    //xhr.setRequestHeader('Content-type', 'multipart/form-data');

    xhr.send(data);
  }
})();


var form = document.querySelector('.ad-form');

form.addEventListener('submit', function (evt) {
  window.upload(new FormData(form), function (response) {
      console.log('clicked');

    });
  evt.preventDefault();
});
