'use strict';
(function () {
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

  // Деактивируем все поля
  makeAllFormsDisable(true);

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

  var onResetButtonClick = function (evt) {
    evt.preventDefault();

    // Блокирует карту
    var map = document.querySelector('.map');
    map.classList.add('map--faded');

    // Блокирует форму
    adForm.classList.add('ad-form--disabled');
    // Блокирует поля
    makeAllFormsDisable(true);
    // Удаляет все отрисованные метки
    var pinListo = document.querySelectorAll('.map__pin');
    for (var i = 1; i < pinListo.length; i++) {
      pinListo[i].remove();
    }
    // Удаляет карточку, если открыта
    var openedCard = document.querySelector('.map__card');
    if (openedCard) {
      openedCard.remove();
    }

    // Сбрасывает формы и скролит вверх страницы
    filtersForm.reset();
    adForm.reset();
    document.documentElement.scrollTop = 0;
    onRoomSelectClick();

    // Ставит метку посередине карты
    pinListo[0].style.top = map.offsetHeight / 2 + 'px';
    pinListo[0].style.left = (map.offsetWidth / 2) - (window.data.Size.PIN_MAIN_WIDTH / 2) + 'px';
    // Прописывает адрес
    var address = document.querySelector('#address');
    address.value = pinListo[0].offsetLeft + ',' + pinListo[0].offsetTop;

    // Ставит изначальную аватарку
    var preview = document.querySelector('.ad-form-header__preview img');
    preview.src = 'img/muffin-grey.svg';

    // Удаляет загруженные кртинки
    var imgBlock = document.querySelector('.ad-form__photo');
    window.data.funcs.removeChildren(imgBlock);

  };

  resetButton.addEventListener('click', onResetButtonClick);

  // Зависимость минимальной цены от типа
  var priceInput = document.querySelector('#price');
  var typeInput = document.querySelector('#type');

  typeInput.addEventListener('click', function () {
    var minPrice = typeInput.value;
    priceInput.min = minPriceFromType[minPrice];
    priceInput.placeholder = priceInput.min;
  });

  // Связь полей времени въезда и выезда
  var timeInInput = document.querySelector('#timein');
  var timeOutInput = document.querySelector('#timeout');
  var timeFieldset = document.querySelector('.ad-form__element--time');

  timeFieldset.addEventListener('click', function (event) {
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

  var onRoomSelectClick = function () {
    // Количество комнат прямопропорционально количеству гостей
    for (i = 0; i < guestsSelect.length; i++) {
      guestsSelect.options[i].disabled = false;
      if (i > roomSelect.selectedIndex) {
        guestsSelect.options[i].disabled = true;
      }
      if (roomSelect.selectedIndex === 3) {
        guestsSelect.options[i].disabled = true;
        guestsSelect.options[3].disabled = false;
      }
      guestsSelect.selectedIndex = roomSelect.selectedIndex;
    }
  };
  roomSelect.addEventListener('click', onRoomSelectClick);

  // Отправка формы------

  // Callback при успешной отправке
  var onSuccessSend = function (xhr, evt) {
  // Переход в неактивное состояние при успешной отправке
    onResetButtonClick(evt);
    // Показывает сообщение об успешной отправке (логика закрытия внутри)
    window.data.funcs.showMessage('#success', '.success', 'main');
  };

  adForm.addEventListener('submit', function (evt) {
    window.xhrRequest('https://js.dump.academy/keksobooking', 'POST', onSuccessSend, window.data.funcs.onError, new FormData(adForm));
    evt.preventDefault();
  });


  window.formToggle = {
    toggle: makeAllFormsDisable,
    onResetButtonClick: onResetButtonClick
  };
})();
