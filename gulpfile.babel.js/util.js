'use strict';

import requireDir from 'require-dir';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';

/**
 * Util
 */
class Util {
  constructor() {
    this.requireDir = requireDir;
    this.fancyLog = fancyLog;
    this.colors = colors;
  }

  /**
   * log
   *
   * @param {string} string notice
   */
  log(string) {
    this.fancyLog(string);
  }

  /**
   * setGlobalVars
   *
   * @param {string} name namespace
   * @param {object} obj variable
   */
  setGlobalVars(name, obj) {
    if(global[name]) {
      this.log([
        'Error! Please rename global vars',
        this.colors.magenta(name)
      ].join(' '));
      process.exit(1);
    }
    if(obj) global[name] = obj;
  }

  /**
   * setRequireDir
   *
   * @param {string} filepath tasks directory path
   * @returns {boolean}
   */
  setRequireDir(filepath) {
    try {
      fs.statSync(filepath);
      this.requireDir(filepath, {recurse: true});
      return true;
    }catch(err) {
      if(err.code === 'ENOENT') {
        if(!fs.existsSync(filepath)) {
          fs.mkdirSync(filepath);
          this.log([
            'Create directory',
            this.colors.magenta(filepath)
          ].join(' '));
        }
        return false;
      }
    }
  }

  /**
   * checkFile
   *
   * @param {string} filepath
   * @returns {boolean}
   */
  checkFile(filepath) {
    try {
      fs.statSync(filepath);
      return true
    }catch(err) {
      if(err.code === 'ENOENT') {
        return false;
      }
    }
  }

  /**
   * createFile
   *
   * @param {string} filepath
   * @param {string} body
   */
  createFile(filepath, body = '') {
    if(!fs.existsSync(filepath)) {
      fs.writeFile(filepath, body, (error) => {});
      this.log([
        'Create file',
        this.colors.magenta(filepath)
      ].join(' '));
    }
  }

  /**
   * getReplaceDir
   *
   * @param {string} filepath directory path
   * @returns {string} replace path
   */
  getReplaceDir(filepath) {
    return filepath.replace(/\\/g, '/');
  }

  /**
   * setIsWatch
   *
   * @param {boolean} bool true or false
   */
  setIsWatch(bool) {
    this._watch = bool;
  }

  /**
   * getIsWatch
   *
   * @returns {boolean}
   */
  getIsWatch() {
    return this._watch || false;
  }

  /**
   * splitExtension
   *
   * @param {string} filename filename
   * @param {boolean} dot ['hoge', '.html'] || ['hoge', 'html']
   * @returns {array}
   */
  splitExtension(filename, dot = true) {
    if(dot) {
      return filename.split(/(?=\.[^.]+$)/);
    }else{
      return filename.split(/\.(?=[^.]+$)/);
    }
  }

};

module.exports = new Util();

