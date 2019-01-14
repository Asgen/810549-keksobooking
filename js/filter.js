'use strict';
(function () {
  var filtersForm = document.querySelector('.map__filters');
  var type = filtersForm.querySelector('#housing-type');
  var price = filtersForm.querySelector('#housing-price');
  var rooms = filtersForm.querySelector('#housing-rooms');
  var guests = filtersForm.querySelector('#housing-guests');
  var features = filtersForm.querySelector('#housing-features');
  var debounce = window.funcs.debounce;

  // Фильтрация по типу жилья
  var typeFilter = function (it) {
    var typeRs = type.value === 'any' || type.value === it.offer.type;
    return typeRs;
  };

  // Фильтрация по цене
  var priceFilter = function (it) {
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
    return priceRs;
  };

  // Фильтрация по кол-ву комнат
  var roomsFilter = function (it) {
    var roomsRs = true;
    if (rooms.value !== 'any') {
      roomsRs = it.offer.rooms === Number(rooms.value);
    }
    return roomsRs;
  };

  // Фильтрация по кол-ву гостей
  var guestsFilter = function (it) {
    var guestsRs = true;
    if (guests.value !== 'any') {
      guestsRs = it.offer.guests === Number(guests.value);
    }
    return guestsRs;
  };

  // Фильтрация по выбранным опциям
  var featuresFilter = function (it) {
    var featuresRs = true;
    var adFeaturesList = it.offer.features;
    var checkedFeatures = features.querySelectorAll('input[type="checkbox"]:checked');

    for (var i = 0; i < checkedFeatures.length; i++) {
      if (adFeaturesList.indexOf(checkedFeatures[i].value) === -1) {
        featuresRs = false;
        break;
      }
    }
    return featuresRs;
  };

  // Callback при изменеии фильров формы
  var onFilterChange = function () {
    var arr = window.data.objects;
    var func = window.renderPins;

    var newArr = arr.filter(function (it) {
      return typeFilter(it) && priceFilter(it) && roomsFilter(it) && guestsFilter(it) && featuresFilter(it);
    });

    func(newArr, '.map__pins', '#pin', '.map__pin');
  };


  filtersForm.addEventListener('change', debounce(onFilterChange, 500));
})();
