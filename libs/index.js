/**
 * tw
 */

import mosca from 'mosca';
import superAgent from 'superagent';
import configMosca from 'config/config-mosca';
import { CronJob } from 'cron';

// import handleJoinClass from './join-section';
import setupMeeting from './metting';

var server = new mosca.Server(configMosca);

var job01 = new CronJob({
  cronTime: '*/30 * * * * *', // every 30 sec
  onTick: function() {
    setupMeeting(server);
  },
  start: false,
});

// init app
console.log('STARTED!');
job01.start();

server.on('error', function(err){
  console.log('ERROR', err);
});
server.on('ready', function(){
  console.log('Mosca server is up and running on port: ' + configMosca.port);
})
server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('>>>PACKET', packet.topic);

  switch (packet.topic) {
    case 'join-class':
      // handleJoinClass(packet, client, server);
      break;
    default: 
      break;
  }
});
