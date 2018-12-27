'use strict';
(function () {
  var filtersForm = document.querySelector('.map__filters');
  var type = filtersForm.querySelector('#housing-type');
  var price = filtersForm.querySelector('#housing-price');
  var rooms = filtersForm.querySelector('#housing-rooms');
  var guests = filtersForm.querySelector('#housing-guests');
  var features = filtersForm.querySelector('#housing-features');
  var checkboxes = features.querySelectorAll('input[type="checkbox"]');
  var currentFeature;
  var feature;


  var isMatches = function (filteredEl, adFeatures) {
    var y = adFeatures.some(function (it) {
      return it === filteredEl;
    });
    if (y) {
      currentFeature = true;
      return true;
    }
    currentFeature = false;
    feature = false;
    return false;
  };

  var filterIt = function (it) {
    // Опции
    var adFeaturesList = it.offer.features;
    var checkedFeatures = [];
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkedFeatures.push(checkboxes[i].value);
      }
    }


    feature = true;
    checkedFeatures.forEach(function (filteredElement) {
      isMatches(filteredElement, adFeaturesList);
    });

    if (checkedFeatures.length === 0) {
      currentFeature = true;
      feature = true;
    }

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

    // Комнаты
    var roomsQuantity;
    switch (rooms.value) {
      case '1':
        roomsQuantity = window.data.AdRoom.ONE;
        break;
      case '2':
        roomsQuantity = window.data.AdRoom.TWO;
        break;
      case '3':
        roomsQuantity = window.data.AdRoom.THREE;
        break;
      case 'any':
        roomsQuantity = it.offer.rooms;
        break;
    }

    // Гости
    var capacity;
    switch (guests.value) {
      case '0':
        capacity = window.data.AdGuest.NONE;
        break;
      case '1':
        capacity = window.data.AdGuest.ONE;
        break;
      case '2':
        capacity = window.data.AdGuest.TWO;
        break;
      case 'any':
        capacity = it.offer.guests;
        break;
    }

    // Тип жилья 'any' + остальные параметры
    if (type.value === 'any' && it.offer.price >= minPrice && it.offer.price < maxPrice && it.offer.rooms === roomsQuantity && it.offer.guests === capacity && currentFeature === true && feature !== false) {
      return true;
    }

    // Остальной тип жилья + остальные параметры
    if (it.offer.price >= minPrice && it.offer.price < maxPrice && it.offer.type === type.value && it.offer.rooms === roomsQuantity && it.offer.guests === capacity && currentFeature === true && feature !== false) {
      return true;
    }
    return false;
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
