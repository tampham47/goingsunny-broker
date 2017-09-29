/**
 *
 */

import moment from 'moment';

var Utils = function() {};

Utils.prototype.getSessionNameByDate = function() {
  return date.format('YYYYMMDD');
};

Utils.prototype.parsePayload = function(payloadStr) {
  var data = null;

  try {
    if (/^[\],:{}\s]*$/.test(payloadStr
      .replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      data = JSON.parse(payloadStr);
    }
  }
  catch (err) {
    data = null;
  }

  return data;
}

export default new Utils();
