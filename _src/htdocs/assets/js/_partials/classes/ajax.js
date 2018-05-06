import axios from 'axios';

export default ((win, doc) => {

  /**
   * Ajax
   */
  return class Ajax {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if(!(this instanceof Ajax)) {
        return new Ajax(opts_);
      }
      this.elem = doc.querySelector('html');
      this.loadingClassName = 'is-ajax-loading';
      this.isLoading = false;
      this.config = {
        method: 'get',
        url: '',
        timeout: 5000
      };

      _.isObject(opts_) && _.extend(this, opts_);

      this.initialize();
    }

    /**
     * initialize
     */
    initialize() {}

    /**
     * set
     *
     * @param {object} elem
     * @param {object} config axios
     * @param {object} cb callback functions
     * @returns {object} promise
     */
    set(elem, config, cb = {onSuccess: () => {}, onFailure: () => {}}) {
      if(this.isLoading || !config || !config.url) return;
      config = _.merge({}, this.config, config)

      this.start(elem);

      return axios(config)
        .then((response) => {
          return new Promise((resolve, reject) => {
            return _.isFunction(cb.onSuccess) &&
              cb.onSuccess(resolve, reject, response, this);
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              return _.isFunction(this.onSuccess) &&
                this.onSuccess(resolve, reject, response, this);
            });
          })
        })
        .catch((error) => {
          return new Promise((resolve, reject) => {
            return _.isFunction(cb.onFailure) &&
              cb.onFailure(resolve, reject, error, this);
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              return _.isFunction(this.onFailure) &&
                this.onFailure(resolve, reject, error, this);
            });
          })
        })
        .finally(() => {
          this.end(elem);
        });
    }

    /**
     * start
     *
     * @param {object} elem
     */
    start(elem) {
      this.isLoading = true;
      if(elem) {
        elem.classList.add(this.loadingClassName);
      }
      if(this.elem) {
        this.elem.classList.add(this.loadingClassName);
      }
    }

    /**
     * end
     *
     * @param {object} elem
     */
    end(elem) {
      if(elem) {
        elem.classList.remove(this.loadingClassName);
      }
      if(this.elem) {
        this.elem.classList.remove(this.loadingClassName);
      }
      this.isLoading = false;
    }

    /**
     * onSuccess
     *
     * @param {function} resolve promise
     * @param {function} reject promise
     * @param {object} response object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onSuccess(resolve, reject, response, obj) {
      return resolve();
    }

    /**
     * onFailure
     *
     * @param {function} resolve promise
     * @param {function} reject promise
     * @param {object} error object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onFailure(resolve, reject, error, obj) {
      return resolve();
    }

  };

})(window, document);
