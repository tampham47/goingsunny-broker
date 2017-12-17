import config from 'config/config';
import superAgent from 'superagent';

const botId = config.BOT_ID;
const token = config.CHAT_TOKEN;

export default () => {
  console.log('remind');

  superAgent
    .get(`${config.API_PATH}/session`)
    .set('Content-Type', 'application/json')
    .query({
      distinct: '_messenger',
    })
    .end((err, res) => {
      const users = res.body;
      const block = '5a361aa5e4b01f19870a8803';

      users.forEach(messenger => {
        superAgent.post(`https://api.chatfuel.com/bots/${botId}/users/${messenger}/send?chatfuel_token=${token}&chatfuel_block_id=${block}`)
          .set('Content-Type', 'application/json')
          .end(function (err, res) {});
      });
    });
}
