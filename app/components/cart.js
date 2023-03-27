import Modal from './modal.js';
import createElement from '../lib/create-element.js';
import escapeHtml from '../lib/escape-html.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
  }

  addProduct(product) {
    const existingProduct = this._findProductByName(product);
    const cartItem = { product: product, count: 1 };

    if (!existingProduct) {
      this.cartItems.push(cartItem);
    } else {
      existingProduct.count++;
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    const existingProduct = this._findProductById(productId);
    const indexOfExistingProduct = this._findProductIndexById(productId);

    if (!existingProduct) { return; } else { existingProduct.count += amount; }
    if (existingProduct.count === 0) { this.cartItems.splice(indexOfExistingProduct, 1); }

    this.onProductUpdate(existingProduct);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((total, item) => total + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + (item.product.price * item.count), 0);
  }

  renderProduct(product, count) {
    return `
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`;
  }

  renderOrderForm() {
    return `<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`;
  }

  renderModal = () => {
    this.modal = new Modal();
    let products = ``;

    for (const cartItem of this.cartItems) {
      products += this.renderProduct(cartItem.product, cartItem.count);
    }

    this.modal.setTitle('Your order');
    this.modal.setBody(createElement(`
    <div>
      ${products}

      ${this.renderOrderForm()}
    </div>`));

    this.modal.open();

    const plusButtons = document.querySelectorAll('.cart-counter__button_plus');
    const minusButtons = document.querySelectorAll('.cart-counter__button_minus');

    this._inModalButtonsController([...plusButtons, ...minusButtons]);

    const form = document.querySelector('.cart-form');
    form.addEventListener('submit', this.onSubmit);
  }

  onProductUpdate = (cartItem) => {
    this.cartIcon.update(this);

    const isModalOpen = document.body.classList.contains('is-modal-open');
    const productId = cartItem.product.id;

    if (isModalOpen) {
      const modalBody = document.querySelector('.modal__body');

      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      productCount.innerHTML = cartItem.count;

      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;

      let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

      if (cartItem.count === 0) {
        this.modal.close();
      }
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const modalTitle = document.querySelector('.modal__title');
    const modalBody = document.querySelector('.modal__body');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.classList.add('is-loading');

    const response = await fetch('https://httpbin.org/post', {
      body: formData,
      method: 'POST',
    });

    modalTitle.innerHTML = 'Success!';
    modalBody.innerHTML = `
    <div class="modal__body-inner">
      <p>
        Order successful! Your order is being cooked :) <br>
        We’ll notify you about delivery time shortly.<br>
        <img src="/assets/images/delivery.gif">
      </p>
    </div>
    `;

    this.cartItems = [];
    this.cartIcon.update(this);

    console.log(response);
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }

  // Private Helpers for Class

  _findProductByName = (product) => {
    return this.cartItems.find(item => item.product.name === product.name);
  };

  _findProductById = (productId) => {
    return this.cartItems.find(item => item.product.id === productId);
  };

  _findProductIndexById = (productId) => {
    return this.cartItems.findIndex(item => item.product.id === productId);
  };

  _inModalButtonsController = (buttons) => {
    const onPlusButtonClick = (e) => {
      const productId = e.target.closest('[data-product-id]').dataset.productId;
      this.updateProductCount(productId, 1);
    };

    const onMinusButtonClick = (e) => {
      const productId = e.target.closest('[data-product-id]').dataset.productId;
      this.updateProductCount(productId, -1);
    };

    for (const button of buttons) {
      if (button.classList.contains('cart-counter__button_plus')) {
        button.addEventListener('click', onPlusButtonClick);
      }
      if (button.classList.contains('cart-counter__button_minus')) {
        button.addEventListener('click', onMinusButtonClick);
      }
    }
  };
}

