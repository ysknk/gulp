export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Intersection
   * <div data-intersection='{"action": "fadeout", "threshold": 0.2}'>hoge</div>
   */
  return class Intersection {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Intersection)) {
        return new Intersection(opts_);
      }

      this.dataAttr = 'data-intersection';

      this.options = {
        classname: {
          init: 'is-intersection-init',
          in: 'is-intersection-in',
          out: 'is-intersection-out'
        },
        action: 'fadein',
        isOnce: true,
        src: '',// image src
        threshold: 0.3// 0 - 1.0 -> screen top - bottom
      };

      this.initializeStyle = `opacity: 0;`;
      this.setInitializeStyle();

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * setInitializeStyle
     */
    setInitializeStyle() {
      let headElem = doc.querySelector('head');
      let styleElem = doc.createElement('style');
      styleElem.innerHTML = `[${this.dataAttr}] {${this.initializeStyle}}`;
      headElem.appendChild(styleElem);
    }

    /**
     * initialize
     */
    initialize() {
      let elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      _.forEach(elems, (elem, i) => {
        let data = this.getParseData(elem);
        data = _.merge({}, this.options, data);

        elem.classList.add(data.classname.init);
        elem.classList.add(data.action);
        elem.classList.remove(data.classname.in);
        elem.classList.remove(data.classname.out);
      });
    }

    /**
     * update
     */
    update() {
      let elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      let windowData = this.getWindowData();
      let bodyHeight = parseInt(doc.body.getBoundingClientRect().height);

      _.forEach(elems, (elem, i) => {
        let data = this.getParseData(elem);
        data = _.merge({}, this.options, data);

        let targetData = this.getTargetData(elem);
        let thresholdDiff = windowData.height * data.threshold;

        // thresholdDiff分の余白がない場合
        if (((targetData.bottom + thresholdDiff) >= bodyHeight &&
          windowData.bottom >= bodyHeight) ||
          ((targetData.top - thresholdDiff) <= 0 &&
            windowData.top <= 0)
        ) {
          this.setIn(elem, data);
        }

        // 余白含めて画面内
        if (targetData.bottom >= windowData.top + thresholdDiff &&
            windowData.bottom - thresholdDiff >= targetData.top) {
          this.setIn(elem, data);
        } else {
          // 一度きりの場合はoutクラスをつけない
          if (!data.isOnce) {
            this.setOut(elem, data);
          }
        }
      });
    }

    /**
     * setIn
     *
     * @param {object} elem
     * @param {object} data
     */
    setIn(elem, data) {
      if (!elem.classList.contains(data.classname.in)) {
        if (data.src) {
          elem.src = data.src;
        }
        elem.classList.remove(data.classname.out);
        elem.classList.add(data.classname.in);
      }
    }

    /**
     * setOut
     *
     * @param {object} elem
     * @param {object} data
     */
    setOut(elem, data) {
      elem.classList.remove(data.classname.in);
      elem.classList.add(data.classname.out);
    }

    /**
     * getParseData
     *
     * @param {object} elem
     * @returns {object}
     */
    getParseData(elem) {
      let data = elem.getAttribute(this.dataAttr) || '';
      let parseData = null;

      if (!data) return;

      try {
        parseData = JSON.parse(data);
      } catch(e) {
        if (console.warn) {
          console.warn(e);
        } else {
          console.log(e);
        }
      }
      return parseData;
    }

    /**
     * getTargetData
     *
     * @param {object} elem target
     * @returns {object}
     */
    getTargetData(elem) {
      let top = this.getOffsetPos(elem).y
                || elem.getBoundingClientRect().y + this.getWindowData().top
                || 0;
      let height = elem.getBoundingClientRect().height;

      return {
        top,
        height,
        bottom: (top + height)
      };
    }

    /**
     * getWindowData
     *
     * @returns {object}
     */
    getWindowData() {
      let top = win.pageYOffset;
      let height = win.innerHeight;

      return {
        top,
        height,
        bottom: (top + height)
      };
    }

    /**
     * getOffsetPos
     *
     * @param {object} elem element
     * @returns {object} position x, y
     */
    getOffsetPos(elem) {
      let pos = {x: 0, y: 0};
      while(elem){
        pos.y += elem.offsetTop || 0;
        pos.x += elem.offsetLeft || 0;
        elem = elem.offsetParent;
      }
      return pos;
    }

  };

})(window, document);

