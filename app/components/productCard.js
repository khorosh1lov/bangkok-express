import createElement from '../lib/create-element.js';

const PRODUCTS_IMGS_PATH = '/assets/images/products/';
const PRODUCT_ADD_EVENT = 'product-add';

function cardTemplate({ name = 'Product', price = 0, image = '' } = {}) {
  return `
  <div class="card">
    <div class="card__top">
      <img src="${PRODUCTS_IMGS_PATH + image}" class="card__image" alt="product">
      <span class="card__price">€${price.toFixed(2)}</span>
    </div>
    <div class="card__body">
      <div class="card__title">${name}</div>
      ${addButtonTemplate()}
    </div>
  </div>`;
}

function addButtonTemplate() {
  return `
    <button type="button" class="card__button" data-action="add">
      <img src="/assets/images/icons/plus-icon.svg" alt="icon">
    </button>`;
}

export default class ProductCard {
  constructor({ name, price, category, image, id }) {
    this._name = name;
    this._price = price;
    this._category = category;
    this._image = image;
    this._id = id;

    this._elem = createElement(cardTemplate({
      name: this._name,
      price: this._price,
      image: this._image
    }));

    this._addButton = this._elem.querySelector('[data-action="add"]');
    this._addButton.addEventListener('click', this._onAddButtonClick);
  }

  get elem() {
    return this._elem;
  }

  _onAddButtonClick = () => {
    let event = new CustomEvent(PRODUCT_ADD_EVENT, {
      detail: this._id,
      bubbles: true
    });

    this._elem.dispatchEvent(event);
  }
}
