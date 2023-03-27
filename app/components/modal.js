import createElement from '../lib/create-element.js';

function modalTemplate() {
  return `
    <div class="modal">
      <div class="modal__overlay"></div>
      <div class="modal__inner">
        <div class="modal__header">
          <button type="button" class="modal__close">
            <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>
          <h3 class="modal__title"></h3>
        </div>
        <div class="modal__body"></div>
      </div>
    </div>
  `;
}

export default class Modal {
  constructor() {
    this._modal       = createElement(modalTemplate());

    this._title       = this._modal.querySelector('.modal__title');
    this._body        = this._modal.querySelector('.modal__body');
    this._closeButton = this._modal.querySelector('.modal__close');

    this._closeButton.addEventListener('click', this._onCloseButtonClick, { once: true });
    document.addEventListener('keydown', this._onEscButtonPressed, { once: true });
  }

  _onCloseButtonClick = () => {
    this.close();
  }

  _onEscButtonPressed = (e) => {
    if (e.code === 'Escape') { this.close(); }
  }

  setTitle = (title) => {
    return this._title.append(title);
  }

  setBody = (body) => {
    return this._body.appendChild(body);
  }

  open = () => {
    document.body.classList.add('is-modal-open');
    document.body.appendChild(this._modal);
  }

  close = () => {
    document.body.classList.remove('is-modal-open');
    this._modal.remove();
  }
}
