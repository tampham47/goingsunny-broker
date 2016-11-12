/**
 *
 */

import superAgent from 'superagent';
import DebugM from 'debug';
var debug = DebugM('system');

export default function(packet, client) {
  var payloadStr = packet.payload.toString();
  var data = {};

  try {
    if (/^[\],:{}\s]*$/.test(payloadStr
      .replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      data = JSON.parse(payloadStr);
    }
    debug('>>>DATA', data, packet);
  }
  catch (err) {
    debug('PARSE ERROR', err);
  }

  if (data.isManual) {
    superAgent.post('http://api.goingsunny.com/api/v1/message')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, res){
        debug('supperagent', err);
      });
  }
}
