import createElement from '../lib/create-element.js';

// Const Custom Event
const SLIDER_CHANGE = 'slider-change';
// Array of All Events to prevent Default behavior for Mobile/Sensor Devices
const DEFAULT_ACTIONS = [
  'dragstart',
  'pointerdown',
  'pointermove'
];

// Main Templates
function sliderTemplate(steps, value) {
  return `
    <div class="slider">
      <div class="slider__thumb">
        <span class="slider__value">${value}</span>
      </div>

      <div class="slider__progress"></div>

      <div class="slider__steps">
        ${stepsBuilder(steps)}
      </div>
    </div>
  `;
}

function stepsBuilder(steps) {
  let sliderSteps = ``;

  for (let i = 0; i < steps; i++) {
    sliderSteps += `<span data-step=${i}></span>`;
  }

  return sliderSteps;
}

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this._totalSteps = steps;
    this._startValue = value;

    // Creating our Main Element with Slider
    this._elem       = createElement(sliderTemplate(this._totalSteps, this._startValue));

    this._allSteps   = this._elem.querySelectorAll('[data-step]');
    this._value      = this.elem.querySelector('.slider__value');
    this._thumb      = this.elem.querySelector('.slider__thumb');
    this._progress   = this._elem.querySelector('.slider__progress');
    this._segments   = this._totalSteps - 1;

    // Init values for Slider
    this._firstStep = this._allSteps[0].classList.add('slider__step-active');
    this._thumb.style.left = '0%';
    this._progress.style.width = '0%';

    // Listeners
    for (const action of DEFAULT_ACTIONS) {
      this._thumb.addEventListener(action, this._preventDefaults);
    }
    this._elem.addEventListener('click', this._onClickEvent);
    this._thumb.addEventListener('pointerdown', this._onThumbDrag);
  }

  // Elem Encapsulation
  get elem() {
    return this._elem;
  }

  _onClickEvent = () => {
    let event = new CustomEvent(SLIDER_CHANGE, {
      // Convert String to Number
      detail: +this._value.innerText,
      bubbles: true
    });
    this._elem.dispatchEvent(event);
  }

  _onThumbDrag = () => {
    this._thumb.style.position = 'absolute';
    this._thumb.style.zIndex = 1000;
    this._elem.classList.add('slider_dragging');

    document.addEventListener('pointermove', this._onMove);

    document.addEventListener('pointerup', () => {
      this._elem.classList.remove('slider_dragging');
      document.removeEventListener('pointermove', this._onMove);
    }, { once: true });
  };

  _onMove = (e) => {
    // Counting where exactly user clicked
    let thumbPositionClicked = (e.clientX - this._elem.getBoundingClientRect().left) / this._elem.offsetWidth;
    if (thumbPositionClicked < 0) { thumbPositionClicked = 0; }
    if (thumbPositionClicked > 1) { thumbPositionClicked = 1; }

    const approxValue = Math.round(thumbPositionClicked * this._segments);
    const approxValueInPercents = thumbPositionClicked * 100;
    const approxStep = this._elem.querySelector(`[data-step="${approxValue}"]`);

    this._allSteps.forEach(approxStep => { approxStep.classList.remove('slider__step-active'); });
    approxStep.classList.add('slider__step-active');

    // Moving Thumb and Values
    this._value.innerHTML = approxValue;
    this._thumb.style.left = `${approxValueInPercents}%`;
    this._progress.style.width = `${approxValueInPercents}%`;
  };

  // stopPropagation & preventDefault for Sensor Devices
  _preventDefaults() {
    return false;
  }
}
