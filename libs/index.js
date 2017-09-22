/**
 * tw
 */

import mosca from 'mosca';
import DebugM from 'debug';
import superAgent from 'superagent';
import configMosca from 'config/config-mosca';
import handleMessage from 'libs/HandleMessage';
import handleJoinClass from 'libs/HandleJoinClass';
import setupMeeting from 'libs/SetupSchedule';
import { CronJob } from 'cron';

var server = new mosca.Server(configMosca);
var debug = DebugM('system');

var arrangeSchedule = function() {
  debug('CRONJOB is working.');
  setupMeeting(server);
};

var job01 = new CronJob({
  // cronTime: '59 * * * * *',
  cronTime: '59 29,59 * * * *',
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
  server.publish({
    topic: 'goingsunny_system_meeting',
    payload: JSON.stringify({
      client: client.id,
      server: new Date(),
    })
  });
});

// fired when a message is received
server.on('published', function(packet, client) {
  debug('>>>PACKET', packet.topic);

  switch (packet.topic) {
    case 'join-class':
      handleJoinClass(packet, client, server);
      break;

    case 'goingsunny':
      handleMessage(packet, client, server);
      break;

    case 'goingsunny_system_meeting':
      // handleMeeting(packet, client);
      break;
    default:
  }
});
