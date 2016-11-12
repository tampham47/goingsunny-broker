/**
 * tw
 */

import mosca from 'mosca';
import DebugM from 'debug';
import superAgent from 'superagent';
import configMosca from 'config/config-mosca';
import handleMessage from 'libs/handle-message';
import handleMeeting from 'libs/handle-meeting';
import setupMeeting from 'libs/setup-meeting';
import { CronJob } from 'cron';

var server = new mosca.Server(configMosca);
var debug = DebugM('system');
var job01 = new CronJob({
  // cronTime: '00 30 11 * * 1-5',
  cronTime: '*/5 * * * * *',
  onTick: function() {
    debug('CRONJOB is working.');
    setupMeeting(server);
  },
  start: false,
});
var job02 = new CronJob({
  cronTime: '30 * * * * *',
  onTick: function() {
  },
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

// fired when a message is received
server.on('published', function(packet, client) {
  debug('>>>PACKET', packet.topic);

  switch (packet.topic) {
    case 'goingsunny':
      handleMessage(packet, client);
      break;

    case 'goingsunny_system_meeting':
      handleMeeting(packet, client);
      break;
    default:
  }
});
