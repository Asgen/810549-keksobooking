'use strict';
(function () {
  var filtersForm = document.querySelector('.map__filters');
  var type = filtersForm.querySelector('#housing-type');
  var price = filtersForm.querySelector('#housing-price');
  var rooms = filtersForm.querySelector('#housing-rooms');
  var guests = filtersForm.querySelector('#housing-guests');
  var features = filtersForm.querySelector('#housing-features');
  var checkedFeatures;
  var adFeaturesList;

  var typeRs;
  var priceRs;
  var roomsRs;
  var guestsRs;
  var featuresRs;

  var filterIt = function (it) {
    // Тип
    typeRs = type.value === 'any' || type.value === it.offer.type;

    // Цена
    var minPrice;
    var maxPrice;
    switch (price.value) {
      case 'low':
        minPrice = 0;
        maxPrice = window.data.AdPrice.LOW;
        break;
      case 'middle':
        minPrice = window.data.AdPrice.LOW;
        maxPrice = window.data.AdPrice.MIDDLE;
        break;
      case 'high':
        minPrice = window.data.AdPrice.MIDDLE;
        maxPrice = window.data.AdPrice.HIGH;
        break;
      case 'any':
        minPrice = 0;
        maxPrice = window.data.AdPrice.HIGH;
        break;
    }
    priceRs = it.offer.price >= minPrice && it.offer.price < maxPrice;

    // Комнаты
    roomsRs = true;
    if (rooms.value !== 'any') {
      roomsRs = String(it.offer.rooms) === rooms.value;
    }

    // Гости
    guestsRs = true;
    if (guests.value !== 'any') {
      guestsRs = String(it.offer.guests) === guests.value;
    }

    // Опции
    featuresRs = true;
    adFeaturesList = it.offer.features;
    checkedFeatures = features.querySelectorAll('input[type="checkbox"]:checked');

    for (var i = 0; i < checkedFeatures.length; i++) {
      adFeaturesList.indexOf(checkedFeatures[i].value);
      if (adFeaturesList.indexOf(checkedFeatures[i].value) === -1) {
        featuresRs = false;
      }
    }

    return typeRs && priceRs && roomsRs && guestsRs && featuresRs;

  };
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
