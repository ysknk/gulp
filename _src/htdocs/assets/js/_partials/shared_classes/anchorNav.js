export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * AnchorNav
   * <a href="#hoge" data-anchor-nav="#hoge">hoge</a>
   * <div id="hoge">hoge</div>
   */
  return class AnchorNav {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof AnchorNav)) {
        return new AnchorNav(opts_);
      }

      this.dataAttr = {
        nav: `data-anchor-nav`
      };

      this.currentClassName = 'is-current';

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * update
     */
    update() {
      let currentNav = this.getCurrentNav();
      this.clearCurrentNav(currentNav);
      this.setCurrentNav(currentNav);
    }

    /**
     * setCurrentNav
     *
     * @param {object} current nav
     */
    setCurrentNav(current) {
      let elem = current && current.elem ? current.elem : '';
      if (elem) {
        elem.classList.add(this.currentClassName)
      }
    }

    /**
     * clearCurrentNav
     *
     * @param {object} current nav
     */
    clearCurrentNav(current) {
      let navs = this.getNavs();

      _.forEach(navs, (nav) => {
        let targetData = this.getTargetData(nav);
        if (!current || nav.selector !== current.selector) {
          nav.classList.remove(this.currentClassName)
        }
      });
    }

    /**
     * getCurrentNav
     *
     * @returns {object} current
     */
    getCurrentNav() {
      let navs = this.getNavs();
      let windowData = this.getWindowData();
      let currentNavs = [];

      _.forEach(navs, (nav, i) => {
        let targetData = this.getTargetData(nav);
        let visualRange = 0;

        // 画面内
        if (targetData.bottom >= windowData.top &&
          windowData.bottom >= targetData.top) {

          // 上部見切れ
          if (targetData.top <= windowData.top) {
            visualRange = targetData.bottom - windowData.top;
          // 下部見切れ
          } else if (targetData.bottom >= windowData.bottom) {
            visualRange = windowData.bottom - targetData.top;
          // 見切れていない
          } else {
            visualRange = targetData.height;
          }

          currentNavs.push({
            num: i,
            selector: targetData.selector,
            elem: nav,
            visualRange
          });
        }
      });

      if (currentNavs && currentNavs.length) {
        currentNavs = _.orderBy(
          currentNavs,
          ['visualRange', 'num'],
          ['desc', 'desc']
        );
      }

      return currentNavs[0] || null;
    }

    /**
     * getNavs
     *
     * @returns {object}
     */
    getNavs() {
      return doc.querySelectorAll(`[${this.dataAttr.nav}]`);
    }

    /**
     * getTargetData
     *
     * @param {object} elem target
     * @returns {object}
     */
    getTargetData(nav) {
      let selector = nav.getAttribute(this.dataAttr.nav);
      let elem = doc.querySelector(selector);

      let top = this.getOffsetPos(elem).y;
      let height = elem ? elem.getBoundingClientRect().height : 0;

      return {
        selector,
        elem,
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

