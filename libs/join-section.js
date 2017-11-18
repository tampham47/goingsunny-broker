/**
 *
 */

import superAgent from 'superagent';
import DebugM from 'debug';
import utils from 'libs/utils';
import request from 'libs/request';

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

  request({
    method: 'POST',
    functionName: 'session',
    body: JSON.stringify({
      _user: data.user._id,
      sessionName: data.session,
    }),
  })
  .then(raw => {
    const body = JSON.parse(raw);
    if (body.statusCode === 400) {
      return; //do nothing
    }

    // broadcast a joining message to all of clients
    broadCastMessage(data, server);
  })
  .catch(err => {});
}
