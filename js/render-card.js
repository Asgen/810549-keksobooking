'use strict';
(function () {
  var remove = window.funcs.removeChildren;
  var makeElement = window.funcs.makeElement;
  var addTextContent = window.funcs.addTextContent;
  var onEscRemove = window.funcs.onEscRemove;
  var size = window.data.Size;

  // Функция добавления описания объявления (если есть)
  var addFeatures = function (cardElement, dataElement) {
    var cardFeatures = cardElement.querySelector('.popup__features');
    remove(cardFeatures);
    // Добавлять features только если они есть
    if (dataElement.offer.features.length) {
      dataElement.offer.features.forEach(function (element) {
        var cardFeature = makeElement('li', 'popup__feature');
        var cardFeatureMod = 'popup__feature--' + element;
        cardFeature.classList.add(cardFeatureMod);

        cardFeatures.appendChild(cardFeature);
      });
    } else {
      cardFeatures.remove();
    }
  };

  // Функция отрусовки фоток в карточке объявления
  var addPhotos = function (cardElement, dataElement) {
    var cardPhotos = cardElement.querySelector('.popup__photos');
    remove(cardPhotos);
    if (dataElement.offer.photos.length) {
      dataElement.offer.photos.forEach(function (element) {
        var cardPhoto = makeElement('img', 'popup__photo');
        cardPhoto.width = size.CARD_PIC_WIDTH;
        cardPhoto.height = size.CARD_PIC_HEIGHT;
        cardPhoto.src = element;

        cardPhotos.appendChild(cardPhoto);
      });
    } else {
      cardPhotos.remove();
    }
  };

  // Функция отрисовки карточки
  // возвращает карточку
  var renderCard = function (templateId, templateClass, dataElement) {
    var cardTypeMap = window.data.cardTypeMap;
    var cardTemplate = document.querySelector(templateId)
      .content
      .querySelector(templateClass);
    var cardElement = cardTemplate.cloneNode(true);

    addTextContent(cardElement, '.popup__title', dataElement.offer.title);
    addTextContent(cardElement, '.popup__text--address', dataElement.offer.address);
    addTextContent(cardElement, '.popup__text--price', dataElement.offer.price + ' ₽/ночь');
    addTextContent(cardElement, '.popup__text--capacity', dataElement.offer.rooms + ' комнаты для ' + dataElement.offer.guests + ' гостей');
    addTextContent(cardElement, '.popup__text--time', 'Заезд после ' + dataElement.offer.checkin + ', выезд до ' + dataElement.offer.checkout);
    // Скрывать блок с описанием если описание отсутствует
    if (dataElement.offer.description.length) {
      addTextContent(cardElement, '.popup__description', dataElement.offer.description);
    } else {
      cardElement.querySelector('.popup__description').remove();
    }

    var cardType = cardElement.querySelector('.popup__type');
    cardType.textContent = cardTypeMap[dataElement.offer.type];

    addFeatures(cardElement, dataElement);
    addPhotos(cardElement, dataElement);

    var cardAvatar = cardElement.querySelector('.popup__avatar');
    cardAvatar.src = dataElement.author.avatar;

    // Закрытие по клику на крестик
    var closeButton = cardElement.querySelector('.popup__close');
    closeButton.addEventListener('click', function () {
      cardElement.remove();
    });
    // Закрытие на Esc
    onEscRemove(cardElement);

    return cardElement;
  };

  window.renderCard = renderCard;
})();
