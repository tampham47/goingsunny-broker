import config from 'config/config';
import superAgent from 'superagent';
import randomWord from 'random-word';
import moment from 'moment';

export default (ontime) => {
  console.log('subscribe', ontime);
  superAgent
    .get(`${config.API_PATH}/subscribe`)
    .set('Content-Type', 'application/json')
    .query({
      query: JSON.stringify({
        subscribeName: moment().format('YYYYMMDD'),
      }),
    })
    .end((err, res) => {
      const subs = res ? res.body : [];
      const botId = config.BOT_ID;
      const token = config.CHAT_TOKEN;

      const blockNotif = '5a1924cfe4b0c921d9db6270'; // subscribe
      const blockStart = '5a192b31e4b0c921da01306a'; // subscribe-ontime
      let block = blockNotif;
      if (ontime) { block = blockStart; }

      // broadcast message
      subs.forEach((i, index) => {
        superAgent.post(`https://api.chatfuel.com/bots/${botId}/users/${i._messenger}/send?chatfuel_token=${token}&chatfuel_block_id=${block}`)
          .set('Content-Type', 'application/json')
          .end(function (err, res) {});
      });
    })
}
