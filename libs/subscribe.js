import config from 'config/config';
import superAgent from 'superagent';
import randomWord from 'random-word';
import moment from 'moment';

export default (server) => {
  console.log('subscribe');
  superAgent
    .get(`${config.API_PATH}/subscribe`)
    .set('Content-Type', 'application/json')
    .query({
      query: JSON.stringify({
        subscribeName: moment().format('YYYYMMDD'),
      }),
    })
    .end((err, res) => {
      const botId = config.BOT_ID;
      const token = config.CHAT_TOKEN;
      const block = '5a1924cfe4b0c921d9db6270';
      const subs = res ? res.body : [];

      // broadcast message
      subs.forEach((i, index) => {
        superAgent.post(`https://api.chatfuel.com/bots/${botId}/users/${i._messenger}/send?chatfuel_token=${token}&chatfuel_block_id=${block}`)
          .set('Content-Type', 'application/json')
          .end(function (err, res) {});
      });
    })
}
