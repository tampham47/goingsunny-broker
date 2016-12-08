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

  debug('SESSION_NAME', utils.getSessionNameByDate());
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
    var channel = randomWord();
    var count = 0;

    sessionList.forEach(function(i) {
      var message = {
        topic: `SYSTEM_${i._user}`,
        payload: JSON.stringify({
          channel: channel,
          data: i
        })
      };
      debug('sessionList', message.topic, message.payload, i);
      server.publish(message);

      superAgent.put(`${config.API_PATH}/session/${i._id}`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        roomName: channel
      }))
      .end(function(err, res) {
        console.log('Schedule', i._id, channel);
      });

      count++;
      if (count >= 2) {
        count = 0;
        channel = randomWord();
      }
    });

  });

};
