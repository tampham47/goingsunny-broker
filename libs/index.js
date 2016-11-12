/**
 * tw
 */

import mosca from 'mosca';
import configMosca from 'config/config-mosca';
import superAgent from 'superagent';
import DebugM from 'debug';

var server = new mosca.Server(configMosca);
var debug = DebugM('system');

debug('STARTED!');

server.on('error', function(err){
  debug('ERROR', err);
});

server.on('ready', function(){
  debug('Mosca server is up and running on port: ' + configMosca.port);
})

server.on('clientConnected', function(client) {
  debug('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  var payloadStr = packet.payload.toString();
  var data = {};

  if (/^[\],:{}\s]*$/.test(payloadStr
    .replace(/\\["\\\/bfnrtu]/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    data = JSON.parse(payloadStr);
  }

  debug('>>>PACKET', packet.topic);
  debug('>>>DATA', data, packet);

  if (data.isManual) {
    superAgent.post('http://api.goingsunny.com/api/v1/message')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, res){
        debug('supperagent', err);
      });
  }
});
