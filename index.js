/**
 * Goingsunny 2016
 * Tw
 */

console.log('Goingsunny has loaded.');

var mosca = require('mosca');
var config = require('./config');

var server = new mosca.Server(config);

server.on('error', function(err){
  console.log(err);
});

server.on('ready', function(){
  console.log('Mosca server is up and running on port: ' + config.port);
});

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});
