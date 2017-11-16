/**
 * tw
 */

import mosca from 'mosca';
import DebugM from 'debug';
import superAgent from 'superagent';
import configMosca from 'config/config-mosca';
import { CronJob } from 'cron';

import handleJoinClass from 'libs/HandleJoinClass';
import setupMeeting from 'libs/SetupMetting';

var server = new mosca.Server(configMosca);
var debug = DebugM('system');

var arrangeSchedule = function() {
  debug('CRONJOB is working.');
  setupMeeting(server);
};

var job01 = new CronJob({
  cronTime: '*/30 * * * * *', // every 30 sec
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
