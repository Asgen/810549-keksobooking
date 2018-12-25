'use strict';
var filtersForm = document.querySelector('.map__filters')
var type = filtersForm.querySelector('#housing-type');
var price = filtersForm.querySelector('#housing-price');
var rooms = filtersForm.querySelector('#housing-rooms');
var guests = filtersForm.querySelector('#housing-guests');
var features = filtersForm.querySelector('#housing-features');

var filterIt = function (it, evt) {
  // Опции

  filter-wifi
  filter-dishwasher
  filter-parking
  filter-washer
  filter-elevator
  filter-conditioner

  var checkFeatures;
  switch (rooms.value) {
    case '1':
      roomsQuantity = 1;
      break;
    case '2':
      roomsQuantity = 2;
      break;
    case '3':
      roomsQuantity = 3;
      break;
    case 'any':
      roomsQuantity = it.offer.rooms;
      break;
  }

  // Цена
  var minPrice, maxPrice;
  switch (price.value) {
    case 'low':
      minPrice = 0;
      maxPrice = 10000;
      break;
    case 'middle':
      minPrice = 10000;
      maxPrice = 50000;
      break;
    case 'high':
      minPrice = 50000;
      maxPrice = Infinity;
      break;
    case 'any':
      minPrice = 0;
      maxPrice = Infinity;
      break;
  }

  // Комнаты
  var roomsQuantity;
  switch (rooms.value) {
    case '1':
      roomsQuantity = 1;
      break;
    case '2':
      roomsQuantity = 2;
      break;
    case '3':
      roomsQuantity = 3;
      break;
    case 'any':
      roomsQuantity = it.offer.rooms;
      break;
  }

  // Гости
  var capacity;
  switch (guests.value) {
    case '0':
      capacity = 0;
      break;
    case '1':
      capacity = 1;
      break;
    case '2':
      capacity = 2;
      break;
    case 'any':
      capacity = it.offer.guests;
      break;
  }

  // Тип жилья 'any' + остальные параметры
  if (type.value === 'any' && it.offer.price >= minPrice && it.offer.price < maxPrice && it.offer.rooms === roomsQuantity && it.offer.guests === capacity) {
    return true
  }

  // Остальной тип жилья + остальные параметры
  if (it.offer.price >= minPrice && it.offer.price < maxPrice && it.offer.type === type.value && it.offer.rooms === roomsQuantity && it.offer.guests === capacity) {
    return true
  }

};
var lastTimeout;
var onFilterChange = function (evt) {
  var newArr = window.data.objects.filter(function (it) {
    return filterIt(it, evt);
  });
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(function () {
    window.renderPins(newArr, '.map__pins', '#pin', '.map__pin');
  }, 500);
};

filtersForm.addEventListener('change', onFilterChange);

