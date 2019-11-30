export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * MouseStalker
   */
  return class MouseStalker {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof MouseStalker)) {
        return new MouseStalker(opts_);
      }

      // this.baseElem = 'body';
      this.baseElem = '';

      this.elem = '.js-mousestalker';
      this.activeClassName = 'is-active';
      this.throttleTime = 30;
      this.debounceTime = this.throttleTime;

      this.initializeStyle = [
        `position: fixed;`,
        `top: 0;`,
        `left: 0;`,
        `transform: translate(0, 0);`,
        `transition: all 0.2s ease-out;`,
        `pointer-events: none;`
      ].join(``);

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.setInitializeStyle();

      doc.addEventListener('mousemove', _.throttle((e) => {
        if (!e.target || !e.target.closest) return;
        let baseElem = this.baseElem ?
          e.target.closest(this.baseElem) : doc;

        let elem = doc.querySelector(this.elem);

        if (e.target === doc || !baseElem) {
          this.onMouseLeave(e, elem);
        } else {
          this.onMouseEnter(e, elem);
        }
      }, this.throttleTime), false);

      // 画面外
      doc.addEventListener('mouseleave', _.debounce((e) => {
        if (!e.target) return;
        let elem = doc.querySelector(this.elem);
        this.onMouseLeave(e, elem);
      }, this.debounceTime), false);
    }

    /**
     * setInitializeStyle
     */
    setInitializeStyle() {
      if (!this.initializeStyle) return;
      let headElem = doc.querySelector('head');
      let styleElem = doc.createElement('style');
      let elemSelector = [this.baseElem, this.elem].join(` `);
      styleElem.innerHTML = `${elemSelector} {${this.initializeStyle}}`;
      headElem.appendChild(styleElem);
    }

    /**
     * onMouseEnter
     *
     * @param {object} e event
     * @param {object} elem
     */
    onMouseEnter(e, elem) {
      if (!elem) return;
      elem.classList.add(this.activeClassName);
      elem.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    /**
     * onMouseLeave
     *
     * @param {object} e event
     * @param {object} elem
     */
    onMouseLeave(e, elem) {
      if (!elem) return;
      // elem.style.transform = ``;
      elem.classList.remove(this.activeClassName);
    }

  };

})(window, document);

