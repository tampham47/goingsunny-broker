/**
 *
 */

import superAgent from 'superagent';
import DebugM from 'debug';
import utils from 'libs/utils';
import request from 'libs/BrokerRequest';

var debug = DebugM('HandleJoinClass');


var broadCastMessage = function(payload, server) {
  var message = {
    topic: 'SYSTEM_CLASS_DATA',
    payload: JSON.stringify(payload.user)
  };
  server.publish(message);
};

/**
 * @param {*} packet { user: {}, session: '---' }
 * @param {*} client 
 * @param {*} server 
 */
export default function(packet, client, server) {
  var payloadStr = packet.payload.toString();
  var data = utils.parsePayload(payloadStr);
  
  broadCastMessage(data, server);

  console.log('HandleJoinClass', data);
  request({
    method: 'POST',
    functionName: 'session',
    body: JSON.stringify({
      _user: data.user._id,
      sessionName: data.session,
    }),
  })
  .then(body => {
    console.log('HandleJoinClass body', body);
  })
  .catch(err => {});
}
