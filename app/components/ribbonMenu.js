import createElement from '../lib/create-element.js';

const SCROLL_RANGE = 350;
const ITEM_SELECT = 'ribbon-select';

const mapCats = (categories) => {
  return categories.map(({ name, id }) => itemTemplate({ name, id })).join('');
};

const itemTemplate = ({ name, id = '' }) => {
  return `
    <a href="#" class="ribbon__item" data-id="${id}">${name}</a>
  `;
};

const ribbonTemplate = (items) => {
  return `
  <div class="ribbon">
    ${makeArrow('left')}

    <nav class="ribbon__inner">
      ${items}
    </nav>

    ${makeArrow('right')}
  </div>
  `;
}

const makeArrow = (direction = 'left') => {
  return `
    <button class="ribbon__arrow ribbon__arrow_${direction} ribbon__arrow_visible">
      <img src="/assets/images/icons/angle-icon.svg" alt="icon">
    </button>
  `;
};

export default class RibbonMenu {
  constructor(categories) {
    this._cats = mapCats(categories);
    this._elem = createElement(ribbonTemplate(this._cats));

    this._arrowLeft   = this._elem.querySelector('.ribbon__arrow_left');
    this._arrowRight  = this._elem.querySelector('.ribbon__arrow_right');
    this._ribbonInner = this._elem.querySelector('.ribbon__inner');
    this._ribbonItems  = this._elem.querySelectorAll('.ribbon__item');

    this._hideArrow(this._arrowLeft);
    this._showArrow(this._arrowRight);
    this._arrowLeft.addEventListener('click', this._onClickArrowLeftButton);
    this._arrowRight.addEventListener('click', this._onClickArrowRightButton);

    for (let _item of this._ribbonItems) {
      _item.addEventListener('click', this._onClickRibbonItem);
    }

  }

  get elem() {
    return this._elem;
  }

  _hideArrow = (arrow) => {
    arrow.classList.remove('ribbon__arrow_visible');
  }

  _showArrow = (arrow) => {
    arrow.classList.add('ribbon__arrow_visible');
  }

  _onClickArrowLeftButton = () => {
    this._ribbonInner.scrollBy(-SCROLL_RANGE, 0);

    this._ribbonInner.addEventListener('scroll', () => {
      this._checkRibbonScroll();
    });
  }

  _onClickArrowRightButton = () => {
    this._ribbonInner.scrollBy(SCROLL_RANGE, 0);

    this._ribbonInner.addEventListener('scroll', this._checkRibbonScroll);
  }

  _checkRibbonScroll = () => {
    this._scrollWidth = this._ribbonInner.scrollWidth;
    this._clientWidth = this._ribbonInner.clientWidth;

    this._scrollLeft  = this._ribbonInner.scrollLeft;
    this._scrollRight = this._scrollWidth - this._scrollLeft - this._clientWidth;

    if (this._scrollLeft !== 0) { this._showArrow(this._arrowLeft); } else {
      this._hideArrow(this._arrowLeft);
    }

    if (this._scrollRight < 1) { this._hideArrow(this._arrowRight); } else {
      this._showArrow(this._arrowRight);
    }
  }

  _onClickRibbonItem = (e) => {
    e.preventDefault();

    const item = e.target;
    const itemId = item.dataset.id;

    this._ribbonItems.forEach(item => { item.classList.remove('ribbon__item_active'); });
    item.classList.add('ribbon__item_active');

    let event = new CustomEvent(ITEM_SELECT, {
      detail: itemId,
      bubbles: true
    });
    this._elem.dispatchEvent(event);
  }
}
