/**
 *
 */

import moment from 'moment';

var Utils = function() {};

Utils.prototype.getSessionNameByDate = function() {
  var date = moment().utc();
  var h = date.hour() * 2;
  var m = ((date.minute() / 30) > 1) ? 1 : 0;
  if ((date.minute() / 30) > 1) {
    h += 1;
  }
  return date.format('YYYYMMDD') + h;
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
