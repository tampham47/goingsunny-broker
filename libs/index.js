/**
 * tw
 */

import mosca from 'mosca';
import superAgent from 'superagent';
import configMosca from 'config/config-mosca';
import { CronJob } from 'cron';

import joinSection from './join-section';
import metting from './metting';
import subscribe from './subscribe';

var server = new mosca.Server(configMosca);

// matching
var job01 = new CronJob({
  cronTime: '*/30 * * * * *', // every 30 sec
  onTick: function() {
    metting(server);
  },
  start: false,
});

// send notification for users who has subscribe this morning
var job02 = new CronJob({
  // cronTime: '00 55 19 * * *', // 19h55 everyday
  cronTime: '30 32 18 * * *', // 19h55 everyday
  onTick: function () {
    subscribe(server);
  },
  start: false,
});

// init app
console.log('STARTED!');
job01.start();
job02.start();

server.on('error', function(err){});
server.on('clientConnected', function(client) {});
server.on('ready', function(){
  console.log('Mosca server is up and running on port: ' + configMosca.port);
})

// fired when a message is received
server.on('published', function(packet, client) {
  switch (packet.topic) {
    case 'join-class':
      joinSection(packet, client, server);
      break;
    default: 
      break;
  }
});
