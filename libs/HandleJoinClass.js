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
    payload: JSON.stringify({
      user: payload
    })
  };
  console.log('sessionList', message.topic, message.payload);
  server.publish(message);
};

export default function(packet, client, server) {
  var payloadStr = packet.payload.toString();
  var data = utils.parsePayload(payloadStr);
  console.log('data', data);

  /**
   * data is current user
   */

  broadCastMessage(data, server);
}
