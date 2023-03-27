import createElement from '../lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    const INIT_Y_COORDINATE_CART = this.elem.getBoundingClientRect().top + window.pageYOffset;
    const isMobile = document.documentElement.clientWidth <= 767;

    const getRightBoundWithOffsetOfContainerElem = document.querySelector('.container').getBoundingClientRect().right + 20;
    const getRightScreenEdgeWithOffset = document.documentElement.clientWidth - this.elem.offsetWidth - 10;

    let leftIndent = `${Math.min(getRightBoundWithOffsetOfContainerElem, getRightScreenEdgeWithOffset)}px`;

    const fixedCart = {
      position: 'fixed',
      top: '50px',
      zIndex: 999,
      right: '10px',
      left: leftIndent
    };

    const topCart = {
      position: '',
      top: '',
      zIndex: '',
      right: '',
      left: ''
    };

    if (window.pageYOffset > INIT_Y_COORDINATE_CART) {
      Object.assign(this.elem.style, topCart);
    } else { Object.assign(this.elem.style, fixedCart); }

    if (isMobile) { Object.assign(this.elem.style, topCart); }
  }
}
