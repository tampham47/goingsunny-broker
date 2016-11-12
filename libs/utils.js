/**
 *
 */

import moment from 'moment';

var Utils = function() {};

Utils.prototype.getSessionNameByDate = function() {
  var date = moment();
  var h = date.hour() * 2;
  var m = ((date.minute() / 30) > 1) ? 1 : 0;
  if ((date.minute() / 30) > 1) {
    h += 1;
  }
  return date.format('YYYYMMDD') + h;
};

export default new Utils();
