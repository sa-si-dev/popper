import { DomUtils } from './utils/dom-utils';

const allPositions = ['top', 'bottom', 'left', 'right'];
const allPositionsClass = allPositions.map((d) => `position-${d}`);
const arrowRotateMapping = {
  top: 'rotate(180deg)',
  left: 'rotate(90deg)',
  right: 'rotate(-90deg)',
};

export class Popper {
  /**
   * Create a Popper
   * @property {element} $popperEle - Popper element
   * @property {element} $triggerEle - Trigger element
   * @property {element} $arrowEle - Arrow icon in the popper
   * @property {string} [position=auto] - Position of popper (top, bottom, left, right, auto)
   * @property {number} [margin=8] - Space between popper and its activator (in pixel)
   * @property {number} [offset=5] - Space between popper and window edge (in pixel)
   * @property {number} [enterDelay=0] - Delay time before showing popper (in milliseconds)
   * @property {number} [exitDelay=0] - Delay time before hiding popper (in milliseconds)
   * @property {number} [showDuration=300] - Transition duration for show animation (in milliseconds)
   * @property {number} [hideDuration=200] - Transition duration for hide animation (in milliseconds)
   * @property {number} [transitionDistance=10] - Distance to translate on show/hide animation (in pixel)
   * @property {number} [zIndex=1] - CSS z-index value for popper
   * @property {function} [afterShow] - Callback function to trigger after show
   * @property {function} [afterHide] - Callback function to trigger after hide
   */
  constructor(options) {
    try {
      this.setProps(options);
      this.init();
    } catch (e) {
      console.warn(`Couldn't initiate popper`);
      console.error(e);
    }
  }

  init() {
    let $popperEle = this.$popperEle;

    if (!$popperEle || !this.$triggerEle) {
      return;
    }

    DomUtils.setStyle($popperEle, 'zIndex', this.zIndex);

    this.setPosition();
  }

  /** set methods - start */
  setProps(options) {
    options = this.setDefaultProps(options);
    let position = options.position ? options.position.toLowerCase() : 'auto';

    this.$popperEle = options.$popperEle;
    this.$triggerEle = options.$triggerEle;
    this.$arrowEle = options.$arrowEle;
    this.margin = parseFloat(options.margin);
    this.offset = parseFloat(options.offset);
    this.enterDelay = parseFloat(options.enterDelay);
    this.exitDelay = parseFloat(options.exitDelay);
    this.showDuration = parseFloat(options.showDuration);
    this.hideDuration = parseFloat(options.hideDuration);
    this.transitionDistance = parseFloat(options.transitionDistance);
    this.zIndex = parseFloat(options.zIndex);
    this.afterShowCallback = options.afterShow;
    this.afterHideCallback = options.afterHide;

    this.hasArrow = this.$arrowEle ? true : false;

    if (position.indexOf(' ') !== -1) {
      let positionArray = position.split(' ');
      this.position = positionArray[0];
      this.secondaryPosition = positionArray[1];
    } else {
      this.position = position;
    }
  }

  setDefaultProps(options) {
    let defaultOptions = {
      position: 'auto',
      margin: 8,
      offset: 5,
      enterDelay: 0,
      exitDelay: 0,
      showDuration: 300,
      hideDuration: 200,
      transitionDistance: 10,
      zIndex: 1,
    };

    return Object.assign(defaultOptions, options);
  }

  setPosition() {
    DomUtils.show(this.$popperEle, 'inline-flex');

    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let popperEleCoords = DomUtils.getAbsoluteCoords(this.$popperEle);
    let triggerEleCoords = DomUtils.getAbsoluteCoords(this.$triggerEle);
    let popperEleWidth = popperEleCoords.width;
    let popperEleHeight = popperEleCoords.height;
    let popperEleTop = popperEleCoords.top;
    let popperEleRight = popperEleCoords.right;
    let popperEleBotttom = popperEleCoords.bottom;
    let popperEleLeft = popperEleCoords.left;
    let triggerEleWidth = triggerEleCoords.width;
    let triggerEleHeight = triggerEleCoords.height;
    let triggerEleTop = triggerEleCoords.top;
    let triggerEleRight = triggerEleCoords.right;
    let triggerEleBottom = triggerEleCoords.bottom;
    let triggerEleLeft = triggerEleCoords.left;
    let topDiff = triggerEleTop - popperEleTop;
    let leftDiff = triggerEleLeft - popperEleLeft;
    let left = leftDiff;
    let top = topDiff;
    let position = this.position;
    let secondaryPosition = this.secondaryPosition;
    let widthCenter = triggerEleWidth / 2 - popperEleWidth / 2;
    let heightCenter = triggerEleHeight / 2 - popperEleHeight / 2;
    let margin = this.margin;
    let transitionDistance = this.transitionDistance;
    let fromTop;
    let fromLeft;
    let topEdge = window.scrollY - popperEleTop;
    let bottomEdge = viewportHeight + topEdge;
    let leftEdge = window.scrollX - popperEleLeft;
    let rightEdge = viewportWidth + leftEdge;
    let inversePosition;
    let viewportOffset = this.offset;

    if (viewportOffset) {
      topEdge += viewportOffset;
      bottomEdge -= viewportOffset;
      leftEdge += viewportOffset;
      rightEdge -= viewportOffset;
    }

    /** find the position which has more space */
    if (position === 'auto') {
      let moreVisibleSides = DomUtils.getMoreVisibleSides(this.$triggerEle);
      position = moreVisibleSides.vertical;
    }

    let positionsValue = {
      top: {
        top: top - popperEleHeight - margin,
        left: left + widthCenter,
      },
      bottom: {
        top: top + triggerEleHeight + margin,
        left: left + widthCenter,
      },
      right: {
        top: top + heightCenter,
        left: left + triggerEleWidth + margin,
      },
      left: {
        top: top + heightCenter,
        left: left - popperEleWidth - margin,
      },
    };

    let positionValue = positionsValue[position];
    top = positionValue.top;
    left = positionValue.left;

    /** setting secondary position value */
    if (secondaryPosition) {
      if (secondaryPosition === 'top') {
        top = topDiff;
      } else if (secondaryPosition === 'bottom') {
        top = topDiff + triggerEleHeight - popperEleHeight;
      } else if (secondaryPosition === 'left') {
        left = leftDiff;
      } else if (secondaryPosition === 'right') {
        left = leftDiff + triggerEleWidth - popperEleWidth;
      }
    }

    /* if popperEle is hiding on left edge */
    if (left < leftEdge) {
      if (position === 'left') {
        inversePosition = 'right';
      } else if (leftEdge + popperEleLeft > triggerEleRight) {
        /** if triggerEle is hiding on left edge */
        left = triggerEleRight - popperEleLeft;
      } else {
        left = leftEdge;
      }
    } else if (left + popperEleWidth > rightEdge) {
      /* if popperEle is hiding on right edge */
      if (position === 'right') {
        inversePosition = 'left';
      } else if (rightEdge + popperEleLeft < triggerEleLeft) {
        /** if triggerEle is hiding on right edge */
        left = triggerEleLeft - popperEleRight;
      } else {
        left = rightEdge - popperEleWidth;
      }
    }

    /* if popperEle is hiding on top edge */
    if (top < topEdge) {
      if (position === 'top') {
        inversePosition = 'bottom';
      } else if (topEdge + popperEleTop > triggerEleBottom) {
        /** if triggerEle is hiding on top edge */
        top = triggerEleBottom - popperEleTop;
      } else {
        top = topEdge;
      }
    } else if (top + popperEleHeight > bottomEdge) {
      /* if popperEle is hiding on bottom edge */
      if (position === 'bottom') {
        inversePosition = 'top';
      } else if (bottomEdge + popperEleTop < triggerEleTop) {
        /** if triggerEle is hiding on bottom edge */
        top = triggerEleTop - popperEleBotttom;
      } else {
        top = bottomEdge - popperEleHeight;
      }
    }

    /** if popper element is hidden in the given position, show it on opposite position */
    if (inversePosition) {
      let inversePositionValue = positionsValue[inversePosition];
      position = inversePosition;

      if (position === 'top' || position === 'bottom') {
        top = inversePositionValue.top;
      } else if (position === 'left' || position === 'right') {
        left = inversePositionValue.left;
      }
    }

    if (position === 'top') {
      fromTop = top + transitionDistance;
      fromLeft = left;
    } else if (position === 'right') {
      fromTop = top;
      fromLeft = left - transitionDistance;
    } else if (position === 'left') {
      fromTop = top;
      fromLeft = left + transitionDistance;
    } else {
      fromTop = top - transitionDistance;
      fromLeft = left;
    }
    fromTop = fromTop;
    fromLeft = fromLeft;

    let transformText = `translate3d(${parseInt(fromLeft)}px, ${parseInt(fromTop)}px, 0)`;

    DomUtils.setStyle(this.$popperEle, 'transform', transformText);
    DomUtils.setData(this.$popperEle, 'fromLeft', fromLeft);
    DomUtils.setData(this.$popperEle, 'fromTop', fromTop);
    DomUtils.setData(this.$popperEle, 'top', top);
    DomUtils.setData(this.$popperEle, 'left', left);
    DomUtils.removeClass(this.$popperEle, allPositionsClass.join(' '));
    DomUtils.addClass(this.$popperEle, `position-${position}`);

    if (this.hasArrow) {
      let arrowLeft = 0;
      let arrowTop = 0;
      let fullLeft = left + popperEleLeft;
      let fullTop = top + popperEleTop;
      let arrowWidthHalf = this.$arrowEle.offsetWidth / 2;
      let rotateText = arrowRotateMapping[position] || '';

      if (position === 'top' || position === 'bottom') {
        let triggerEleWidthCenter = triggerEleWidth / 2 + triggerEleLeft;
        arrowLeft = triggerEleWidthCenter - fullLeft;

        /** if arrow crossed left edge of popper element */
        if (arrowLeft < arrowWidthHalf) {
          arrowLeft = arrowWidthHalf;
        } else if (arrowLeft > popperEleWidth - arrowWidthHalf) {
          /** if arrow crossed right edge of popper element */
          arrowLeft = popperEleWidth - arrowWidthHalf;
        }
      } else if (position === 'left' || position === 'right') {
        let triggerEleHeightCenter = triggerEleHeight / 2 + triggerEleTop;
        arrowTop = triggerEleHeightCenter - fullTop;

        /** if arrow crossed top edge of popper element */
        if (arrowTop < arrowWidthHalf) {
          arrowTop = arrowWidthHalf;
        } else if (arrowTop > popperEleHeight - arrowWidthHalf) {
          /** if arrow crossed bottom edge of popper element */
          arrowTop = popperEleHeight - arrowWidthHalf;
        }
      }

      DomUtils.setStyle(this.$arrowEle, 'transform', `translate3d(${parseInt(arrowLeft)}px, ${parseInt(arrowTop)}px, 0) ${rotateText}`);
    }

    DomUtils.hide(this.$popperEle);
  }

  resetPosition() {
    DomUtils.setStyle(this.$popperEle, 'transform', 'none');
    this.setPosition();
  }
  /** set methods - end */

  /**
   * @prop {boolean} [resetPosition] - Recalculate position before show
   * @prop {object} [data] - Any custom data which would be passed to afterShow callback function call
   */
  show({ resetPosition, data } = {}) {
    clearTimeout(this.exitDelayTimeout);
    clearTimeout(this.hideDurationTimeout);

    if (resetPosition) {
      this.resetPosition();
    }

    this.enterDelayTimeout = setTimeout(() => {
      let left = DomUtils.getData(this.$popperEle, 'left');
      let top = DomUtils.getData(this.$popperEle, 'top');
      let transformText = `translate3d(${parseInt(left)}px, ${parseInt(top)}px, 0)`;
      let showDuration = this.showDuration;

      DomUtils.show(this.$popperEle, 'inline-flex');

      /** calling below method to force redraw - it would move the popper element to its fromLeft and fromTop position */
      DomUtils.getCoords(this.$popperEle);

      DomUtils.setStyle(this.$popperEle, 'transitionDuration', showDuration + 'ms');
      DomUtils.setStyle(this.$popperEle, 'transform', transformText);
      DomUtils.setStyle(this.$popperEle, 'opacity', 1);

      this.showDurationTimeout = setTimeout(() => {
        if (typeof this.afterShowCallback === 'function') {
          this.afterShowCallback(data);
        }
      }, showDuration);
    }, this.enterDelay);
  }

  /**
   * @prop {object} [data] - Any custom data which would be passed to afterHide callback function call
   */
  hide({ data } = {}) {
    clearTimeout(this.enterDelayTimeout);
    clearTimeout(this.showDurationTimeout);

    this.exitDelayTimeout = setTimeout(() => {
      if (this.$popperEle) {
        let left = parseInt(DomUtils.getData(this.$popperEle, 'fromLeft'));
        let top = parseInt(DomUtils.getData(this.$popperEle, 'fromTop'));
        let transformText = `translate3d(${left}px, ${top}px, 0)`;
        let hideDuration = this.hideDuration;

        DomUtils.setStyle(this.$popperEle, 'transitionDuration', hideDuration + 'ms');
        DomUtils.setStyle(this.$popperEle, 'transform', transformText);
        DomUtils.setStyle(this.$popperEle, 'opacity', 0);

        this.hideDurationTimeout = setTimeout(() => {
          DomUtils.hide(this.$popperEle);

          if (typeof this.afterHideCallback === 'function') {
            this.afterHideCallback(data);
          }
        }, hideDuration);
      }
    }, this.exitDelay);
  }

  updatePosition() {
    DomUtils.setStyle(this.$popperEle, 'transitionDuration', '0ms');

    this.resetPosition();

    let left = parseInt(DomUtils.getData(this.$popperEle, 'left'));
    let top = parseInt(DomUtils.getData(this.$popperEle, 'top'));

    DomUtils.show(this.$popperEle, 'inline-flex');
    DomUtils.setStyle(this.$popperEle, 'transform', `translate3d(${left}px, ${top}px, 0)`);
  }
}

window.PopperComponent = Popper;
