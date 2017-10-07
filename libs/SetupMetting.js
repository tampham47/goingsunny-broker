/**
 *
 */

import config from 'config/config';
import superAgent from 'superagent';
import randomWord from 'random-word';
import DebugM from 'debug';

import utils from 'libs/utils';
import request from 'libs/BrokerRequest';
var debug = DebugM('system');

export default function(server) {
  debug('SESSION_NAME', utils.getSessionNameByDate());
  superAgent.get(`${config.API_PATH}/session`)
  .set('Content-Type', 'application/json')
  .query({
    query: JSON.stringify({
      sessionName: utils.getSessionNameByDate(),
      roomName: '',
    }),
    populate: '_user',
  })
  .end(function(err, res){
    console.log('supperagent', res && res.body);
    var sessionList = res ? res.body : [];
    var room = randomWord();
    var count = 0;

    sessionList.forEach(function(i, index) {
      var nextIndex = count === 0 ? index + 1 : index - 1;
      var matched = sessionList[nextIndex] ? sessionList[nextIndex]._user : {};
      var message = {
        topic: `SYSTEM_${i._user._id}`,
        payload: JSON.stringify({
          room,
          matched,
        })
      };
      debug('sessionList', message.topic, message.payload, i);
      server.publish(message);

      request({
        method: 'PUT',
        functionName: `session/${i._id}`,
        body: JSON.stringify({
          roomName: room
        })
      }).then(function(body) {
        debug('Schedule', 'DONE');
      })
      .catch(function(err) {
        debug('Schedule', err);
      });

      count++;
      if (count >= 2) {
        count = 0;
        room = randomWord();
      }
    });
  });
};
