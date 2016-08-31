/**
 * Goingsunny 2016
 * Tw
 */

console.log('Goingsunny has loaded.');

var mosca = require('mosca');
var config = require('./config');
var superAgent = require('superagent');
var server = new mosca.Server(config);

server.on('error', function(err){
  console.log('ERROR', err);
});

server.on('ready', function(){
  console.log('Mosca server is up and running on port: ' + config.port);
});

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
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

  console.log('>>>DATA', data);

  if (data.isManual) {
    superAgent.post('http://api.goingsunny.com/api/v1/message')
    // superAgent.post('http://localhost:5600/api/v1/message')
      .set('Content-Type', 'application/json')
      .send(data)
      .end(function(err, res){
        console.log('supperagent', err);
      });
  }
});
