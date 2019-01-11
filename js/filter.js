'use strict';
(function () {
  var filtersForm = document.querySelector('.map__filters');
  var type = filtersForm.querySelector('#housing-type');
  var price = filtersForm.querySelector('#housing-price');
  var rooms = filtersForm.querySelector('#housing-rooms');
  var guests = filtersForm.querySelector('#housing-guests');
  var features = filtersForm.querySelector('#housing-features');
  var debounce = window.funcs.debounce;

  // Функция проверяет входящий объект по всем условиям и возвращает true при успехе
  var filterIt = function (it) {
    // Тип
    var typeRs = type.value === 'any' || type.value === it.offer.type;

    // Цена
    var priceAd = window.data.AdPrice;
    var priceRs;
    switch (price.value) {
      case 'low':
        priceRs = it.offer.price >= 0 && it.offer.price < priceAd.LOW;
        break;
      case 'middle':
        priceRs = it.offer.price >= priceAd.LOW && it.offer.price < priceAd.MIDDLE;
        break;
      case 'high':
        priceRs = it.offer.price >= priceAd.MIDDLE && it.offer.price < priceAd.HIGH;
        break;
      case 'any':
        priceRs = it.offer.price >= 0 && it.offer.price < priceAd.HIGH;
        break;
    }

    // Комнаты
    var roomsRs = true;
    if (rooms.value !== 'any') {
      roomsRs = it.offer.rooms === Number(rooms.value);
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

  // Callback при изменеии фильров формы
  var onFilterChange = function () {
    var arr = window.data.objects;
    var func = window.renderPins;

    var newArr = arr.filter(function (it) {
      return filterIt(it);
    });

    func(newArr, '.map__pins', '#pin', '.map__pin');
  };

  filtersForm.addEventListener('change', debounce(onFilterChange, 500));
})();
