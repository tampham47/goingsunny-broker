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

      if (i._messenger) {
        console.log('_messenger', i._messenger, room);
        // https://api.chatfuel.com/bots/59f28d26e4b0640c0cdc9930/users/1198515213577392/send?chatfuel_token=mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD&chatfuel_block_id=59f44008e4b0640c169bc44d&link=https://appear.in/xaolonist
        superAgent.post(`https://api.chatfuel.com/bots/59f28d26e4b0640c0cdc9930/users/${i._messenger}/send?chatfuel_token=mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD&chatfuel_block_id=59f44008e4b0640c169bc44d&link=https://appear.in/${room}`)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          console.log('chatfuel', err, res);
        });
      } else {
        var message = {
          topic: `SYSTEM_${i._user._id}`,
          payload: JSON.stringify({
            room,
            matched,
          })
        };
        server.publish(message);
      }

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
