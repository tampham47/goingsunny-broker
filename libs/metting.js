/**
 *
 */

import config from 'config/config';
import superAgent from 'superagent';
import randomWord from 'random-word';
import moment from 'moment';

import request from 'libs/request';

export default function(server) {
  superAgent
  .get(`${config.API_PATH}/session`)
  .set('Content-Type', 'application/json')
  .query({
    query: JSON.stringify({
      sessionName: moment().format('YYYYMMDD'),
      roomName: '',
    }),
    populate: '_user',
  })
  .end(function(err, res) {
    var mmdd = moment().format('MMDD');
    var sessionList = res ? res.body : [];
    var room = randomWord() + mmdd;
    var count = 0;

    console.log('sessionList', sessionList.length);
    if (sessionList.length % 2 !== 0) {
      sessionList.pop();
    }

    sessionList.forEach(function(i, index) {
      var nextIndex = count === 0 ? index + 1 : index - 1;
      var matched = sessionList[nextIndex] ? sessionList[nextIndex]._user : {};

      const botId = '59fc4cb4e4b02606ed00dbb5';
      const token = '97pemuDTh2tINlcezl86IAF2O6ZXdnmddM0CenJGUr90D5XdSAuFT0IP8c1g9Rdf';
      const block = '59fc4cb5e4b02606ed00de30';

      if (i._messenger) {
        superAgent.post(`https://api.chatfuel.com/bots/${botId}/users/${i._messenger}/send?chatfuel_token=${token}&chatfuel_block_id=${block}&link=https://appear.in/${room}`)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {});
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
        console.log('Schedule', 'DONE');
      })
      .catch(function(err) {
        console.log('Schedule', err);
      });

      count++;
      if (count >= 2) {
        count = 0;
        room = randomWord() + mmdd;
      }
    });
  });
};
