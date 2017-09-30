/**
 * tw
 */

import mosca from 'mosca';
import DebugM from 'debug';
import superAgent from 'superagent';
import configMosca from 'config/config-mosca';
import handleJoinClass from 'libs/HandleJoinClass';
import setupMeeting from 'libs/SetupSchedule';
import { CronJob } from 'cron';
// import handleMessage from 'libs/HandleMessage';

var server = new mosca.Server(configMosca);
var debug = DebugM('system');

var arrangeSchedule = function() {
  debug('CRONJOB is working.');
  setupMeeting(server);
};

var job01 = new CronJob({
  cronTime: '00 */2 * * * *', // every 2 mins
  onTick: function() {
    arrangeSchedule();
  },
  start: false,
});

// init app
debug('STARTED!');
job01.start();

server.on('error', function(err){
  debug('ERROR', err);
});
server.on('ready', function(){
  debug('Mosca server is up and running on port: ' + configMosca.port);
})
server.on('clientConnected', function(client) {
  debug('client connected', client.id);
});

setInterval(function() {
  console.log('server', Object.keys(server.clients).length);
  server.publish({
    topic: 'goingsunny_system_meeting',
    payload: JSON.stringify({
      server: new Date(),
      clients: Object.keys(server.clients),
      count: Object.keys(server.clients).length,
    })
  });
}, 3000);

// fired when a message is received
server.on('published', function(packet, client) {
  debug('>>>PACKET', packet.topic);

  switch (packet.topic) {
    case 'join-class':
      handleJoinClass(packet, client, server);
      break;
    default: 
      break;
  }
});
