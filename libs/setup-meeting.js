/**
 *
 */

import config from 'config/config';
import superAgent from 'superagent';
import utils from 'libs/utils';
import DebugM from 'debug';
var debug = DebugM('system');

export default function(server) {

  superAgent.get(`${config.API_PATH}/session`)
  .set('Content-Type', 'application/json')
  .query({
    query: JSON.stringify({
      sessionName: utils.getSessionNameByDate()
    })
  })
  .end(function(err, res){
    debug('supperagent', res.body);
    var sessionList = res.body;

    sessionList.forEach(function(i) {
      debug('sessionList each', i);

      var message = {
        topic: `SYSTEM_${i._user}`,
        payload: JSON.stringify({
          channel: 'gsun-' + Math.round(Math.random() * 1000),
          data: i
        })
      };
      server.publish(message);
    });

  });

};
