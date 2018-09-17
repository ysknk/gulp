import _extend from 'lodash/extend';
import _forEach from 'lodash/forEach';
import _isObject from 'lodash/isObject';

export default ((win, doc) => {
  'use strict';

  /**
   * Tab
   */
  return class Tab {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if(!(this instanceof Tab)) {
        return new Tab(opts_);
      }

      this.baseElem = 'body';

      this.dataAttr = 'data-tab';
      this.activeClassName = 'is-active';

      this.duration = 1000;
      this.easing = 'easeInOutQuart';

      _isObject(opts_) && _extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let data;

      this.setIsActive(false);

      // タブ切り替え
      doc.addEventListener('click', (e) => {
        let elem = e.target.closest([// delegate
          this.baseElem,
          `[${this.dataAttr}]`
        ].join(' '));

        if(!elem || e.target === doc) return;

        data = this.toJson(elem.getAttribute(this.dataAttr));
        if(this.hasActive(elem)) {
          // @current close
          // this.onHide(elem, data);
          return;
        }else{
          this.open(elem, data);
        }
      });
    }

    /**
     * setActive
     */
    setActive() {
      let elems = doc.querySelectorAll([
        this.baseElem,
        `[${this.dataAttr}]`
      ].join(' '));
      let data;

      // set state
      _forEach(elems, (elem) => {
        if(this.hasActive(elem)) {
          data = this.toJson(elem.getAttribute(this.dataAttr));
          this.open(elem, data);
        }
      });
    }

    /**
     * open
     *
     * @param {object} elem btn
     * @param {object} data json btn,category,group
     */
    open(elem, data) {
      if(this.getIsActive()) return;
      this.setIsActive(true);

      let groups = document.querySelectorAll([
        this.baseElem,
        data.group
      ].join(' '));
      if(!groups.length) return;

      // set btn class
      let btns = document.querySelectorAll([
        this.baseElem,
        data.btn
      ].join(' '));
      if(!btns.length) return;

      _forEach(btns, (btn) => {
        if(elem === btn) {
          btn.classList.add(this.activeClassName);
        }else{
          btn.classList.remove(this.activeClassName);
        }
      });

      // not current close
      let name = data.category.replace(/^(\.|\#)/, '');
      let hideElems = new Array();
      let current = null;

      _forEach(groups, (group) => {
        if(group.classList.contains(name)) {
          current = group;
        }else{
          hideElems.push(group);
        }
      });

      // hide
      if(hideElems.length) {
        _forEach(hideElems, (hideElem) => {
          hideElem.classList.remove(this.activeClassName);
          this.onHid(hideElem, data);
        });
        this.onHide(hideElems, data);
      }

      // show
      current.classList.add(this.activeClassName);
      this.onShow(current, data);
      this.onShowed(current, data);

      this.setIsActive(false);
    }

    /**
     * hasActive
     *
     * @param {object} elem element
     * @returns {boolean}
     */
    hasActive(elem) {
      return elem.classList.contains(this.activeClassName);
    }

    /**
     * toJson
     *
     * @param {string} str
     * @returns {object} json
     */
    toJson(str) {
      return JSON.parse(str);
    }

    /**
     * onShow
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onShow(elem, data) {}

    /**
     * onShowed
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onShowed(elem, data) {}

    /**
     * onHide
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onHide(elem, data) {}

    /**
     * onHid
     *
     * @param {object} elem group or elem
     * @param {object} data json
     */
    onHid(elem, data) {}

    /**
     * setIsActive
     *
     * @param {boolean} bool
     */
    setIsActive(bool) {
      this.isActive = bool;
    }

    /**
     * getIsActive
     *
     * @returns {boolean}
     */
    getIsActive() {
      return this.isActive;
    }

  };

})(window, document);

