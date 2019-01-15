'use strict';
(function () {
  var funcs = window.funcs;

  // Мапа для минимальной цены
  var minPriceFromType = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  // Кнопка reset
  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var filtersForm = document.querySelector('.map__filters');

  // Функция активации/деактивации полей ввода
  // принимает true или false
  var makeAllFormsDisable = function (status) {
    var fieldsets = document.querySelectorAll('fieldset');
    var selects = document.querySelectorAll('.map__filters select');

    var disableIt = function (arr, statusx) {
      for (var i = 0; i < arr.length; i++) {
        arr[i].disabled = statusx;
      }
    };
    disableIt(fieldsets, status);
    disableIt(selects, status);
  };
  // Деактивируем все поля по умолчанию
  makeAllFormsDisable(true);

  // Функция удаления всех меток кроме главной
  var removePins = function () {
    var pinList = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pinList.forEach(function (element) {
      element.remove();
    });
  };

  // Функция удаляет карточку, если открыта
  var removeOpenedCard = function () {
    var openedCard = document.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }
  };

  // Сброс карты
  var resetMap = function () {
    // Блокирует карту
    var map = document.querySelector('.map');
    map.classList.add('map--faded');

    // Ставит главную метку посередине карты
    var pinMainWidth = window.data.Size.PIN_MAIN_WIDTH;
    var mainPin = document.querySelector('.map__pin--main');
    mainPin.style.top = map.offsetHeight / 2 + 'px';
    mainPin.style.left = (map.offsetWidth / 2) - (pinMainWidth / 2) + 'px';

    removePins();
    removeOpenedCard();
  };

  // Сброс формы
  var resetForm = function () {
    // Блокирует форму
    adForm.classList.add('ad-form--disabled');

    // Сбрасывает формы и скролит вверх страницы
    filtersForm.reset();
    adForm.reset();
    document.documentElement.scrollTop = 0;
    onRoomSelectChange();

    // Прописывает адрес
    var mainPin = document.querySelector('.map__pin--main');
    var address = document.querySelector('#address');
    address.value = mainPin.offsetLeft + ',' + mainPin.offsetTop;

    // Ставит изначальную аватарку
    var preview = document.querySelector('.ad-form-header__preview img');
    preview.src = 'img/muffin-grey.svg';

    // Удаляет загруженные картинки
    var imgBlock = document.querySelector('.ad-form__photo');
    funcs.removeChildren(imgBlock);

    makeAllFormsDisable(true);
  };

  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    resetMap();
    resetForm();
  };

  resetButton.addEventListener('click', onResetButtonClick);

  // Зависимость минимальной цены от типа
  var priceInput = document.querySelector('#price');
  var typeInput = document.querySelector('#type');

  typeInput.addEventListener('change', function () {
    var minPrice = typeInput.value;
    priceInput.min = minPriceFromType[minPrice];
    priceInput.placeholder = priceInput.min;
  });

  // Связь полей времени въезда и выезда
  var timeInInput = document.querySelector('#timein');
  var timeOutInput = document.querySelector('#timeout');
  var timeFieldset = document.querySelector('.ad-form__element--time');

  timeFieldset.addEventListener('change', function (event) {
    var target = event.target; // где был клик?
    if (target === timeInInput) {
      timeOutInput.selectedIndex = timeInInput.selectedIndex;
    } else {
      timeInInput.selectedIndex = timeOutInput.selectedIndex;
    }
  });

  // Количество гостей зависит от количества комнат
  var roomSelect = document.querySelector('#room-number');
  var guestsSelect = document.querySelector('#capacity');

  for (var i = 1; i < (guestsSelect.length); i++) {
    guestsSelect.options[i].disabled = true;
  }

  var onRoomSelectChange = function () {
    // Количество комнат прямопропорционально количеству гостей
    for (i = 0; i < guestsSelect.length; i++) {
      guestsSelect.options[i].disabled = false;

      if (i >= Number(roomSelect.value)) {
        guestsSelect.options[i].disabled = true;
      }

      if (roomSelect.value === window.data.MAX_ROOMS) {
        guestsSelect.options[i].disabled = true;
        guestsSelect.querySelector('option[value="0"]').disabled = false;
      }

      // Проверка на соответствие количества гостей количеству комнат
      // Если не соответствует, то вывести сообщение
      if (guestsSelect.options[guestsSelect.selectedIndex].disabled) {
        guestsSelect.setCustomValidity('Кто-то лишний:)');
      } else {
        guestsSelect.setCustomValidity('');
      }
    }
  };
  roomSelect.addEventListener('change', onRoomSelectChange);

  // Сброс ошибки при изменении кол-ва гостей (т.к. неправильный вариант выбрать невозможно)
  var onGuestsChange = function () {
    if (!guestsSelect.options[guestsSelect.selectedIndex].disabled) {
      guestsSelect.setCustomValidity('');
    }
  };
  guestsSelect.addEventListener('change', onGuestsChange);

  // Отправка формы------

  // Callback при успешной отправке
  var onSuccessSend = function (xhr, evt) {
    // Переход в неактивное состояние при успешной отправке
    onResetButtonClick(evt);
    // Показывает сообщение об успешной отправке (логика закрытия внутри)
    funcs.showMessage('#success', '.success', 'main');
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.xhrRequest('https://js.dump.academy/keksobooking', 'POST', onSuccessSend, funcs.onError, new FormData(adForm));
  });

  window.formToggle = {
    toggle: makeAllFormsDisable,
    onResetButtonClick: onResetButtonClick
  };
})();
