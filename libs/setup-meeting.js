/**
 *
 */

import config from 'config/config';
import superAgent from 'superagent';
import utils from 'libs/utils';
import randomWord from 'random-word';
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
    debug('supperagent', res && res.body);
    var sessionList = res ? res.body : [];

    sessionList.forEach(function(i) {
      debug('sessionList each', i);

      var message = {
        topic: `SYSTEM_${i._user}`,
        payload: JSON.stringify({
          channel: randomWord(),
          data: i
        })
      };
      server.publish(message);
    });

  });

};
