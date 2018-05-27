'use strict';

// @author ysknk
const pluginName = 'log';
const text = {
  'stream': 'Stream not supported',
  'publish': 'Publish >>> ',
  'title': pluginName
};

module.exports = (opts_) => {
  opts_ = _.merge({}, {
    title: '',
    logMessage: false
  }, opts_);

  let transformStream = new Transform({objectMode: true});

  /**
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an
   *          error argument and data) when you are done processing the supplied chunk.
   */
  transformStream._transform = (file, encoding, callback) => {
    if(file.isNull()) {
      callback(null, file);
    }

    if(file.isStream()){
      return callback(new pluginError(pluginName, text.stream));
    }

    let relative = file.relative.replace(/\\/g, '/');
    let path = colors.bold(colors.magenta(relative));
    let result = text.publish + path;

    notifier.notify({
      title: opts_.title ?
        (text.title + ': ' + opts_.title) : text.title,
      message: relative,
      sound: false,
      wait: false,
      timeout: 1,
      type: 'info'
    });

    if(opts_.logMessage) {
      fancyLog(result);
    }
    callback(null, file);
  };

  return transformStream;

};

