/**
 *
 */

import config from 'config/config';

export default function(server) {
  var message = {
    topic: config.MEETING_TOPIC,
    payload: JSON.stringify({
      channel: Math.random()
    })
  };
  server.publish(message);
};
