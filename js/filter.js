'use strict';
(function () {
  var filtersForm = document.querySelector('.map__filters');
  var type = filtersForm.querySelector('#housing-type');
  var price = filtersForm.querySelector('#housing-price');
  var rooms = filtersForm.querySelector('#housing-rooms');
  var guests = filtersForm.querySelector('#housing-guests');
  var features = filtersForm.querySelector('#housing-features');

  // Функция проверяет входящий объект по всем условиям и возвращает true при успехе
  var filterIt = function (it) {
    // Тип
    var typeRs = type.value === 'any' || type.value === it.offer.type;

    // Цена
    var priceRs;
    switch (price.value) {
      case 'low':
        priceRs = it.offer.price >= 0 && it.offer.price < window.data.AdPrice.LOW;
        break;
      case 'middle':
        priceRs = it.offer.price >= window.data.AdPrice.LOW && it.offer.price < window.data.AdPrice.MIDDLE;
        break;
      case 'high':
        priceRs = it.offer.price >= window.data.AdPrice.MIDDLE && it.offer.price < window.data.AdPrice.HIGH;
        break;
      case 'any':
        priceRs = it.offer.price >= 0 && it.offer.price < window.data.AdPrice.HIGH;
        break;
    }

    // Комнаты
    var roomsRs = true;
    if (rooms.value !== 'any') {
      roomsRs = String(it.offer.rooms) === rooms.value;
    }

    // Гости
    var guestsRs = true;
    if (guests.value !== 'any') {
      guestsRs = it.offer.guests === Number(guests.value);
    }

    // Опции
    var featuresRs = true;
    var adFeaturesList = it.offer.features;
    var checkedFeatures = features.querySelectorAll('input[type="checkbox"]:checked');

    for (var i = 0; i < checkedFeatures.length; i++) {
      if (adFeaturesList.indexOf(checkedFeatures[i].value) === -1) {
        featuresRs = false;
      }
    }

    return typeRs && priceRs && roomsRs && guestsRs && featuresRs;

  };

  // Callback при изменеии фильров формы с задержкой в полсек.
  var lastTimeout;
  var onFilterChange = function () {
    var newArr = window.data.objects.filter(function (it) {
      return filterIt(it);
    });
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      window.renderPins(newArr, '.map__pins', '#pin', '.map__pin');
    }, 500);
  };

  filtersForm.addEventListener('change', onFilterChange);
})();
