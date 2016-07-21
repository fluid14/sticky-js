
class Sticky {
  constructor(element) {
    this.element = element;

    this.vp = this.getViewportSize();
    this.scrollTop = this.getScrollTopPosition();

    this.initialize();
  }

  initialize() {
    const stickyElements = document.querySelectorAll(this.element);

    for (let i = 0, len = stickyElements.length; i < len; i++) {
      window.addEventListener('load', () => this.activate(stickyElements[i]));
    }
  }

  activate(el) {
    el.sticky = {};

    el.sticky.marginTop = el.getAttribute('data-margin-top') ? parseInt(el.getAttribute('data-margin-top')) : 0;
    el.sticky.rect = this.getRect(el);

    el.sticky.container = this.getContainer(el);
    el.sticky.container.rect = this.getRect(el.sticky.container);

    window.addEventListener('resize', () => {
      this.vp = this.getViewportSize();
      this.updateRect(el);
      this.setPosition(el);
    });

    window.addEventListener('scroll', () => this.scrollTop = this.getScrollTopPosition());
    window.addEventListener('scroll', () => this.setPosition(el));

    this.setPosition(el);
  }

  getRect(el) {
    const position = this.getTopLeftPosition(el);

    position.offsetLeft = el.offsetLeft;
    position.width = el.offsetWidth;
    position.height = el.offsetHeight;

    return position;
  }

  updateRect(el) {
    this.removeStyle(el, [ 'position', 'width', 'top', 'left', 'right', 'bottom']);

    el.sticky.rect = this.getRect(el);
    el.sticky.container.rect = this.getRect(el.sticky.container);
  }

  getTopLeftPosition(el) {
    let top = 0, left = 0;

    do {
      top += el.offsetTop  || 0;
      left += el.offsetLeft || 0;
      el = el.offsetParent;
    } while(el);

    return { top, left };
  }

  getContainer(el) {
    let container = el;

    while (
      typeof container.getAttribute('data-sticky-container') !== 'string'
      && container !== document.documentElement
    ) {
      container = container.parentNode;
    }

    return container;
  }

  getViewportSize() {
    return {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  }

  getScrollTopPosition() {
    return (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0) || 0;
  }

  setPosition(el) {
    if (this.vp.height < el.sticky.rect.height) {
      return;
    }

    this.removeStyle(el, [ 'position', 'width', 'top', 'left', 'right', 'bottom']);

    if (this.scrollTop > (el.sticky.rect.top - el.sticky.marginTop)) {
      this.addStyle(el, {
        position: 'fixed',
        width: el.sticky.rect.width + 'px',
        left: el.sticky.rect.left + 'px',
        right: 'auto',
        bottom: 'auto',
      });

      if ((this.scrollTop + el.sticky.rect.height + el.sticky.marginTop) > (el.sticky.container.rect.top + el.sticky.container.rect.height)) {
        this.addStyle(el, { top: (el.sticky.container.rect.top + el.sticky.container.rect.height) - (this.scrollTop + el.sticky.rect.height) + 'px' });
      } else {
        this.addStyle(el, { top: el.sticky.marginTop + 'px' });
      }
    } else {
      this.removeStyle(el, [ 'position', 'width', 'top', 'left', 'right', 'bottom']);
    }
  }

  addStyle(el, styles) {
    for (let property in styles) {
      if (styles.hasOwnProperty(property)) {
        el.style[property] = styles[property]
      }
    }
  }

  removeStyle(el, properties) {
    for (let i = 0, len = properties.length; i < len; i++) {
      el.style[properties[i]] = null;
    }
  }
}