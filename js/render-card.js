'use strict';
(function () {
  // Мапа для типа жилья отрисованной карточки
  var cardTypeTranslated = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  // Функция создания элемента
  var makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    element.classList.add(className);
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  // Функция удаления всех детей элемента
  var removeChildren = function (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  // Функция добавление текстового содержимого элементу родителя
  var addTextContent = function (parent, elementClass, text) {
    var element = parent.querySelector(elementClass);
    element.textContent = text;
  };

  // Функция отрисовки карточки
  // возвращает карточку
  var renderCard = function (templateId, templateClass, dataElement) {
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
    cardType.textContent = cardTypeTranslated[dataElement.offer.type];

    var cardFeatures = cardElement.querySelector('.popup__features');
    removeChildren(cardFeatures);
    // Добавлять features только если они есть
    if (dataElement.offer.features.length) {
      for (var i = 0; i < dataElement.offer.features.length; i++) {
        var cardFeature = makeElement('li', 'popup__feature');
        var cardFeatureMod = 'popup__feature--' + dataElement.offer.features[i];
        cardFeature.classList.add(cardFeatureMod);

        cardFeatures.appendChild(cardFeature);
      }
    } else {
      cardFeatures.remove();
    }

    var cardPhotos = cardElement.querySelector('.popup__photos');
    removeChildren(cardPhotos);
    if (dataElement.offer.photos.length) {
      for (i = 0; i < dataElement.offer.photos.length; i++) {
        var cardPhoto = makeElement('img', 'popup__photo');
        cardPhoto.width = window.data.consts.CARD_PIC_WIDTH;
        cardPhoto.height = window.data.consts.CARD_PIC_HEIGHT;
        cardPhoto.src = dataElement.offer.photos[i];

        cardPhotos.appendChild(cardPhoto);
      }
    } else {
      cardPhotos.remove();
    }

    var cardAvatar = cardElement.querySelector('.popup__avatar');
    cardAvatar.src = dataElement.author.avatar;

    // Закрытие по клику на крестик
    var closeButton = cardElement.querySelector('.popup__close');
    closeButton.addEventListener('click', function () {
      cardElement.remove();
    });
    // Закрытие на Esc
    window.data.funcs.onEscRemove(cardElement);

    return cardElement;
  };

  window.renderCard = renderCard;
})();