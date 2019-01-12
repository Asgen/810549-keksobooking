'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('#images');
  var imgBlock = document.querySelector('.ad-form__photo');

  fileChooser.addEventListener('change', function () {
    var files = fileChooser.files;
    if (files) {
      for (var i = 0; i < files.length; i++) {

        var fileName = files[i].name.toLowerCase();

        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', function (e) {

            var picture = document.createElement('img');
            picture.src = e.target.result;
            picture.width = 50;
            picture.height = 50;
            picture.style.marginRight = '3px';

            imgBlock.appendChild(picture);

          });
          reader.readAsDataURL(files[i]);
        }
      }
    }
  });
})();
